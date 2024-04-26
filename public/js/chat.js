document.addEventListener('DOMContentLoaded', () => {
    let socket;
    const chatButtons = document.querySelectorAll('.card__btn');
  
    let activeFullname;
    let myUsername = document.querySelector('.users-container').dataset.myUsername;

    chatButtons.forEach(function (btn) {
        btn.addEventListener('click', function () {
            const fullname = btn.getAttribute('data-fullname');
            activeFullname = fullname; 
            var modalTitle = document.getElementById('chatModalLabel');
            modalTitle.textContent = 'Chateando con ' + fullname;
            var chatUsername = document.querySelector('.chat-h2');
            chatUsername.textContent = fullname;
      
            if (!socket) {
                socket = io();

                socket.on('connect', () => {
                    console.log('Connected to server');
                    socket.emit('newUser', { user: myUsername });
                });
        
                socket.on('newMessage', (data) => {
                    const sender = data.user === myUsername ? 'You' : data.user;
                    appendMessage(data.message, 'incoming', sender);
                });
        
                socket.on('userLeft', (data) => {
                    appendMessage(`${data.user} left the chat`, 'info');
                });
            }
      
            document.querySelector('.chat-body').innerHTML = ''; 
        });
    });
  
    $('#chatModal').on('hidden.bs.modal', function () {
        if (socket) {
            socket.emit('disconnectRequest');
            socket = null; 
        }
    });
  
    const messageForm = document.querySelector('.chat-footer form');
    const messageInput = document.querySelector('.form-control');
    const chatBody = document.querySelector('.chat-body');
    
    if (messageForm) {
        messageForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const message = messageInput.value.trim();
            if (message && socket) {
                socket.emit('newMessage', { user: myUsername, message });
                appendMessage(message, 'outgoing', 'You');
                messageInput.value = '';
            }
        });
    }
  
    function appendMessage(message, type, sender = activeFullname) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', type);
        messageDiv.innerHTML = `<strong>${sender}:</strong> <p>${message}</p>`;
        chatBody.appendChild(messageDiv);
        chatBody.scrollTop = chatBody.scrollHeight; 
    }
});
