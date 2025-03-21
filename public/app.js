function renderRecipes(recipes) {
    const list = document.getElementById('recipe-list');
    list.innerHTML = '';
  
    recipes.forEach(recipe => {
      const col = document.createElement('div');
      col.className = 'col-md-6 col-lg-4';
      const card = document.createElement('div');
      card.className = 'card h-100';
  
      card.innerHTML = `
        ${recipe.image ? `<img src="${recipe.image}" class="card-img-top" alt="${recipe.title}"/>` : ''}
        <div class="card-body">
          <h5 class="card-title">${recipe.title}</h5>
          <p><strong>Ingredients:</strong> ${recipe.ingredients.join(', ')}</p>
          <p>${recipe.instructions}</p>
        </div>
        <div class="card-footer text-end">
          <button class="btn btn-sm btn-danger" onclick="deleteRecipe('${recipe._id}')">Delete</button>
        </div>
      `;
  
      col.appendChild(card);
      list.appendChild(col);
    });
  }
  
  function fetchAndRenderRecipes(query = '') {
    fetch('/recipes')
      .then(res => res.json())
      .then(data => {
        const filtered = data.filter(recipe =>
          recipe.title.toLowerCase().includes(query.toLowerCase()) ||
          recipe.ingredients.join(', ').toLowerCase().includes(query.toLowerCase())
        );
        renderRecipes(filtered);
      });
  }
  
  function showToast(message, success = true) {
    const toast = document.getElementById('toast');
    toast.classList.remove('bg-success', 'bg-danger');
    toast.classList.add(success ? 'bg-success' : 'bg-danger');
    toast.querySelector('.toast-body').textContent = message;
    new bootstrap.Toast(toast).show();
  }
  
  document.getElementById('search').addEventListener('input', e => {
    fetchAndRenderRecipes(e.target.value);
  });
  
  document.getElementById('recipe-form').addEventListener('submit', e => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
  
    fetch('/recipes', {
      method: 'POST',
      body: formData
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to save recipe');
        return res.json();
      })
      .then(() => {
        form.reset();
        fetchAndRenderRecipes();
        bootstrap.Modal.getInstance(document.getElementById('recipeModal')).hide();
        showToast('Recipe saved successfully!');
      })
      .catch(err => {
        console.error(err);
        showToast('Error saving recipe.', false);
      });
  });
  
  function deleteRecipe(id) {
    if (!confirm('Are you sure you want to delete this recipe?')) return;
  
    fetch(`/recipes/${id}`, {
      method: 'DELETE'
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to delete');
        fetchAndRenderRecipes();
        showToast('Recipe deleted');
      })
      .catch(() => showToast('Error deleting recipe', false));
  }
  
  // Light/Dark Mode Toggle
  document.getElementById('modeToggle').addEventListener('change', (e) => {
    document.body.classList.toggle('dark-mode', e.target.checked);
  });
  
  // Initial Load
  fetchAndRenderRecipes();
  