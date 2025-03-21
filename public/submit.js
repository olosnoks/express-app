document.getElementById('recipe-form').addEventListener('submit', function (e) {
    e.preventDefault();
  
    const title = document.getElementById('title').value.trim();
    const ingredients = document.getElementById('ingredients').value.split(',').map(s => s.trim());
    const instructions = document.getElementById('instructions').value.trim();
  
    fetch('/recipes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, ingredients, instructions })
    })
      .then(res => res.json())
      .then(data => {
        alert('Recipe added!');
        location.reload();
      })
      .catch(err => {
        console.error('Error adding recipe:', err);
        alert('Failed to add recipe');
      });
  });
  