class InventoryApp {
    constructor() {
        this.baseUrl = 'http://localhost:3000/api';
        this.categories = [];
        this.products = [];
        this.editingCategory = null;
        this.editingProduct = null;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadData();
    }

    setupEventListeners() {
        // Tab navigation
        document.querySelectorAll('.tab-button').forEach(button => {
            button.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });

        // Category form
        document.getElementById('categoryForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleCategorySubmit();
        });

        document.getElementById('categoryCancelEdit').addEventListener('click', () => {
            this.cancelCategoryEdit();
        });

        // Product form
        document.getElementById('productForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleProductSubmit();
        });

        document.getElementById('productCancelEdit').addEventListener('click', () => {
            this.cancelProductEdit();
        });
    }

    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-button').forEach(button => {
            button.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(tabName).classList.add('active');

        // Load categories for product form if switching to products tab
        if (tabName === 'products') {
            this.loadCategoriesForSelect();
        }
    }

    async loadData() {
        await Promise.all([
            this.loadCategories(),
            this.loadProducts()
        ]);
    }

    // Alert system
    showAlert(message, type = 'success') {
        const alertsContainer = document.getElementById('alerts');
        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.textContent = message;
        
        alertsContainer.appendChild(alert);
        
        setTimeout(() => {
            alert.remove();
        }, 5000);
    }

    // API helpers
    async apiCall(endpoint, options = {}) {
        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Error ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            this.showAlert(error.message, 'error');
            throw error;
        }
    }

    // Categories management
    async loadCategories() {
        try {
            this.categories = await this.apiCall('/categories');
            this.renderCategoriesTable();
        } catch (error) {
            console.error('Error loading categories:', error);
        }
    }

    renderCategoriesTable() {
        const tbody = document.getElementById('categoriesTableBody');
        
        if (this.categories.length === 0) {
            tbody.innerHTML = '<tr><td colspan="3" class="loading">No hay categorías disponibles</td></tr>';
            return;
        }

        tbody.innerHTML = this.categories.map(category => `
            <tr>
                <td>${category.id}</td>
                <td>${category.name}</td>
                <td>
                    <button class="btn-edit" onclick="app.editCategory(${category.id})">Editar</button>
                    <button class="btn-delete" onclick="app.deleteCategory(${category.id})">Eliminar</button>
                </td>
            </tr>
        `).join('');
    }

    async handleCategorySubmit() {
        const name = document.getElementById('categoryName').value.trim();
        
        if (!name) {
            this.showAlert('Por favor ingrese un nombre para la categoría', 'error');
            return;
        }

        try {
            if (this.editingCategory) {
                await this.apiCall(`/categories/${this.editingCategory}`, {
                    method: 'PUT',
                    body: JSON.stringify({ name })
                });
                this.showAlert('Categoría actualizada exitosamente');
            } else {
                await this.apiCall('/categories', {
                    method: 'POST',
                    body: JSON.stringify({ name })
                });
                this.showAlert('Categoría creada exitosamente');
            }

            this.resetCategoryForm();
            this.loadCategories();
            this.loadCategoriesForSelect(); // Update product form select
        } catch (error) {
            console.error('Error submitting category:', error);
        }
    }

    editCategory(id) {
        const category = this.categories.find(c => c.id === id);
        if (!category) return;

        this.editingCategory = id;
        document.getElementById('categoryId').value = id;
        document.getElementById('categoryName').value = category.name;
        document.getElementById('categorySubmit').textContent = 'Actualizar Categoría';
        document.getElementById('categoryCancelEdit').style.display = 'inline-block';
    }

    cancelCategoryEdit() {
        this.editingCategory = null;
        this.resetCategoryForm();
    }

    resetCategoryForm() {
        document.getElementById('categoryForm').reset();
        document.getElementById('categoryId').value = '';
        document.getElementById('categorySubmit').textContent = 'Crear Categoría';
        document.getElementById('categoryCancelEdit').style.display = 'none';
        this.editingCategory = null;
    }

    async deleteCategory(id) {
        if (!confirm('¿Está seguro de que desea eliminar esta categoría?')) {
            return;
        }

        try {
            await this.apiCall(`/categories/${id}`, {
                method: 'DELETE'
            });
            this.showAlert('Categoría eliminada exitosamente');
            this.loadCategories();
            this.loadCategoriesForSelect(); // Update product form select
        } catch (error) {
            console.error('Error deleting category:', error);
        }
    }

    // Products management
    async loadProducts() {
        try {
            this.products = await this.apiCall('/products');
            this.renderProductsTable();
        } catch (error) {
            console.error('Error loading products:', error);
        }
    }

    renderProductsTable() {
        const tbody = document.getElementById('productsTableBody');
        
        if (this.products.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="loading">No hay productos disponibles</td></tr>';
            return;
        }

        tbody.innerHTML = this.products.map(product => {
            const category = this.categories.find(c => c.id === product.category_id);
            return `
                <tr>
                    <td>${product.id}</td>
                    <td>${product.name}</td>
                    <td>${product.description || 'Sin descripción'}</td>
                    <td>$${parseFloat(product.price).toFixed(2)}</td>
                    <td>${product.stock}</td>
                    <td>${category ? category.name : 'Sin categoría'}</td>
                    <td>
                        <button class="btn-edit" onclick="app.editProduct(${product.id})">Editar</button>
                        <button class="btn-delete" onclick="app.deleteProduct(${product.id})">Eliminar</button>
                    </td>
                </tr>
            `;
        }).join('');
    }

    async loadCategoriesForSelect() {
        if (this.categories.length === 0) {
            await this.loadCategories();
        }

        const select = document.getElementById('productCategory');
        select.innerHTML = '<option value="">Seleccione una categoría</option>';
        
        this.categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            select.appendChild(option);
        });
    }

    async handleProductSubmit() {
        const name = document.getElementById('productName').value.trim();
        const description = document.getElementById('productDescription').value.trim();
        const price = parseFloat(document.getElementById('productPrice').value);
        const stock = parseInt(document.getElementById('productStock').value);
        const category_id = parseInt(document.getElementById('productCategory').value);

        if (!name || !price || !stock || !category_id) {
            this.showAlert('Por favor complete todos los campos obligatorios', 'error');
            return;
        }

        if (price < 0) {
            this.showAlert('El precio debe ser mayor o igual a 0', 'error');
            return;
        }

        if (stock < 0) {
            this.showAlert('El stock debe ser mayor o igual a 0', 'error');
            return;
        }

        const productData = {
            name,
            description,
            price,
            stock,
            category_id
        };

        try {
            if (this.editingProduct) {
                await this.apiCall(`/products/${this.editingProduct}`, {
                    method: 'PUT',
                    body: JSON.stringify(productData)
                });
                this.showAlert('Producto actualizado exitosamente');
            } else {
                await this.apiCall('/products', {
                    method: 'POST',
                    body: JSON.stringify(productData)
                });
                this.showAlert('Producto creado exitosamente');
            }

            this.resetProductForm();
            this.loadProducts();
        } catch (error) {
            console.error('Error submitting product:', error);
        }
    }

    editProduct(id) {
        const product = this.products.find(p => p.id === id);
        if (!product) return;

        this.editingProduct = id;
        document.getElementById('productId').value = id;
        document.getElementById('productName').value = product.name;
        document.getElementById('productDescription').value = product.description || '';
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productStock').value = product.stock;
        document.getElementById('productCategory').value = product.category_id;
        document.getElementById('productSubmit').textContent = 'Actualizar Producto';
        document.getElementById('productCancelEdit').style.display = 'inline-block';
    }

    cancelProductEdit() {
        this.editingProduct = null;
        this.resetProductForm();
    }

    resetProductForm() {
        document.getElementById('productForm').reset();
        document.getElementById('productId').value = '';
        document.getElementById('productSubmit').textContent = 'Crear Producto';
        document.getElementById('productCancelEdit').style.display = 'none';
        this.editingProduct = null;
    }

    async deleteProduct(id) {
        if (!confirm('¿Está seguro de que desea eliminar este producto?')) {
            return;
        }

        try {
            await this.apiCall(`/products/${id}`, {
                method: 'DELETE'
            });
            this.showAlert('Producto eliminado exitosamente');
            this.loadProducts();
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    }
}

// Initialize the app when the page loads
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new InventoryApp();
});