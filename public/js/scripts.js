document.addEventListener('DOMContentLoaded', function() {
  const colors = [
    '#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#46f0f0', '#f032e6',
    '#bcf60c', '#fabebe', '#008080', '#e6beff', '#9a6324', '#fffac8', '#800000', '#aaffc3',
    '#808000', '#ffd8b1', '#000075', '#808080',
    '#32c787', '#00a5f9', '#f34235', '#fba026', '#f1e000', '#67b7e1',
    '#d004d3', '#39b54a', '#d4145a'
  ];  
  const cards = document.querySelectorAll('.eh-parent');

  cards.forEach(card => {
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    card.querySelector('.eh-content-box').style.backgroundColor = randomColor;
  });
});

function asistirEvento(eventoId) {
  fetch(`/eventos/${eventoId}/asistente`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token')  
      },
      body: JSON.stringify({
          attendeeId: '{{userLoggedIn._id}}'  
      })
  })
  .then(response => response.json())
  .then(data => {
      alert(data.mensaje);  
  })
  .catch(error => {
      console.error('Error:', error);
  });
}
