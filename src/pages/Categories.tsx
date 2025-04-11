import React from 'react';
import { Pencil, Trash2, FolderTree } from 'lucide-react';
import { useStore } from '../store';
import AddCategoryModal from '../components/AddCategoryModal';

const Categories: React.FC = () => {
  const { categories, fetchCategories, deleteCategory, updateCategory, setIsAddCategoryModalOpen, isAddCategoryModalOpen } = useStore();
  const [editingCategory, setEditingCategory] = React.useState<string | null>(null);
  const [editedName, setEditedName] = React.useState<string>('');

  React.useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this category? This will affect all items in this category.')) {
      await deleteCategory(id);
      await fetchCategories();
    }
  };

  const getNestedCategories = (parentId: string | null): typeof categories => {
    return categories.filter(category => category.parent_id === parentId);
  };

  const renderCategories = (parentId: string | null = null, depth = 0) => {
    const nestedCategories = getNestedCategories(parentId);

    return nestedCategories.map((category) => (
      <React.Fragment key={category.id}>
        <tr className="hover:bg-gray-50">
          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
            <div className="flex items-center" style={{ paddingLeft: `${depth * 1.5}rem` }}>
              <FolderTree className="h-5 w-5 text-gray-400 mr-2" />
              {editingCategory === category.id ? (
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="border border-gray-300 rounded-md p-1"
                />
              ) : (
                category.name
              )}
            </div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {categories.find(c => c.id === category.parent_id)?.name || '-'}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
            {editingCategory === category.id ? (
              <>
                <button
                  onClick={async () => {
                    await updateCategory({ ...category, name: editedName });
                    setEditingCategory(null);
                  }}
                  className="text-green-600 hover:text-green-800 mr-4"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingCategory(null)}
                  className="text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    setEditingCategory(category.id);
                    setEditedName(category.name);
                  }}
                  className="text-indigo-600 hover:text-indigo-900 mr-4"
                >
                  <Pencil className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDelete(category.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </>
            )}
          </td>
        </tr>
        {renderCategories(category.id, depth + 1)}
      </React.Fragment>
    ));
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Categories</h1>
          <button
            onClick={() => setIsAddCategoryModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Add Category
          </button>
        </div>

        <div className="mt-8 flex flex-col">
          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
              <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Parent Category
                      </th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {renderCategories(null)}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <AddCategoryModal
          isOpen={isAddCategoryModalOpen}
          onClose={() => setIsAddCategoryModalOpen(false)}
        />
      </div>
    </div>
  );
};

export default Categories;