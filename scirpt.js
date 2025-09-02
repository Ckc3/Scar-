
document.addEventListener('DOMContentLoaded', function() {
    

    const dockItems = document.querySelectorAll('.dock-item');
    const modals = document.querySelectorAll('.modal');
    const closeButtons = document.querySelectorAll('.close');
    const desktop = document.getElementById('desktop');
    const backgroundMusic = document.getElementById('background-music');
    

    const terminalInput = document.getElementById('terminal-input');
    const terminalOutput = document.getElementById('terminal-output');
    

    let musicPlaying = false;
    

    const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1412496002463563837/nFUw1jOHMitqXthmQ5C1BZFiv5doVfc9ABsgJp8rHVapReq6_swzQZk3bgnsjAGSM9YL';
    

    desktop.addEventListener('click', function(e) {
        if (!musicPlaying && e.target === desktop) {
            backgroundMusic.play().catch(err => {
                console.log('Music autoplay prevented by browser');
            });
            musicPlaying = true;
        }
    });
    

    const terminalCommands = {
        'discord': 'Opening Discord invite... https://discord.gg/5ZQF6fdXze',
        'help': 'Available command: discord',
        'clear': 'CLEAR_TERMINAL'
    };
    

    const dock = document.querySelector('.dock');
    if (dock) {
        dock.addEventListener('mousemove', function(e) {
            const dockRect = this.getBoundingClientRect();
            const mouseX = e.clientX;
            
            dockItems.forEach(item => {
                const itemRect = item.getBoundingClientRect();
                const itemCenter = itemRect.left + itemRect.width / 2;
                const distance = Math.abs(mouseX - itemCenter);
                const maxDistance = 150;
                
                if (distance < maxDistance) {
                    const scale = 1 + (1 - distance / maxDistance) * 0.3;
                    const translateY = (1 - distance / maxDistance) * -12;
                    item.style.transform = `scale(${scale}) translateY(${translateY}px)`;
                } else {
                    item.style.transform = 'scale(1) translateY(0)';
                }
            });
        });
        
        dock.addEventListener('mouseleave', function() {
            dockItems.forEach(item => {
                item.style.transform = 'scale(1) translateY(0)';
            });
        });
    }
    

    dockItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.stopPropagation();
            const app = this.getAttribute('data-app');
            

            this.classList.add('launching');
            

            setTimeout(() => {
                this.classList.remove('launching');
            }, 800);
            

            setTimeout(() => {
                openModal(app);
            }, 200);
        });
    });
    

    function openModal(modalId) {
        const modal = document.getElementById(modalId + '-modal');
        if (modal) {

            modal.classList.remove('closing');
            const modalContent = modal.querySelector('.modal-content');
            if (modalContent) {
                modalContent.classList.remove('closing');
            }
            
            modal.classList.add('show');
            modal.style.display = 'flex';
            

            if (modalId === 'terminal') {
                setTimeout(() => {
                    if (terminalInput) terminalInput.focus();
                }, 200);
            }
            

            if (modalId === 'text') {
                setTimeout(() => {
                    const nameInput = document.getElementById('name');
                    if (nameInput) nameInput.focus();
                }, 200);
            }
        }
    }
    
    function closeModal(modal) {
        const modalContent = modal.querySelector('.modal-content');
        

        modal.classList.add('closing');
        if (modalContent) {
            modalContent.classList.add('closing');
        }
        

        setTimeout(() => {
            modal.classList.remove('show', 'closing');
            if (modalContent) {
                modalContent.classList.remove('closing');
            }
            modal.style.display = 'none';
        }, 300);
    }
    

    closeButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const modalId = this.getAttribute('data-modal');
            const modal = document.getElementById(modalId + '-modal');
            

            const correspondingDockItem = document.querySelector(`[data-app="${modalId}"]`);
            if (correspondingDockItem) {
                correspondingDockItem.classList.add('closing');
                setTimeout(() => {
                    correspondingDockItem.classList.remove('closing');
                }, 400);
            }
            
            closeModal(modal);
        });
    });
    

    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal(this);
            }
        });
    });
    

    function makeDraggable(element) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        
        element.onmousedown = dragMouseDown;
        
        function dragMouseDown(e) {
            e = e || window.event;
            

            if (e.target.tagName === 'INPUT' || 
                e.target.tagName === 'TEXTAREA' || 
                e.target.tagName === 'BUTTON' ||
                e.target.tagName === 'LABEL' ||
                e.target.closest('.message-form') ||
                e.target.closest('.form-group') ||
                e.target.closest('.send-btn')) {
                return;
            }
            
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }
        
        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
            element.style.position = "fixed";
        }
        
        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }
    

    document.querySelectorAll('.modal-content').forEach(makeDraggable);
    

    if (terminalInput) {
        terminalInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const command = this.value.trim().toLowerCase();
                

                addTerminalLine(`scarlett@desktop:~$ ${this.value}`);
                

                if (terminalCommands[command]) {
                    if (command === 'clear') {
                        clearTerminal();
                    } else if (command === 'discord') {
                        addTerminalLine(terminalCommands[command]);

                        setTimeout(() => {
                            window.open('https://discord.gg/5ZQF6fdXze', '_blank');
                        }, 1000);
                    } else {
                        addTerminalLine(terminalCommands[command]);
                    }
                } else if (command === '') {

                } else {
                    addTerminalLine(`Command not found: ${command}. Type 'help' for available commands.`);
                }
                

                this.value = '';
                

                terminalOutput.scrollTop = terminalOutput.scrollHeight;
            }
        });
    }
    
    function addTerminalLine(text) {
        if (terminalOutput) {
            const line = document.createElement('div');
            line.className = 'terminal-line';
            line.textContent = text;
            terminalOutput.appendChild(line);
        }
    }
    
    function clearTerminal() {
        if (terminalOutput) {
            terminalOutput.innerHTML = `
                <div class="terminal-line">Last login: ${new Date().toLocaleString()} on ttys000</div>
                <div class="terminal-line">Welcome to Scarlett's Terminal!</div>
                <div class="terminal-line">Type 'help' for available commands.</div>
            `;
        }
    }
    

    async function sendToDiscord(name, email, message) {
        const embed = {
            title: "📨 New Message from Website",
            color: 0x5865F2, 
            fields: [
                {
                    name: "👤 Name",
                    value: name,
                    inline: true
                },
                {
                    name: "📧 Email",
                    value: email,
                    inline: true
                },
                {
                    name: "💬 Message",
                    value: message,
                    inline: false
                }
            ],
            timestamp: new Date().toISOString(),
            footer: {
                text: "Scarlett's Desktop Website"
            }
        };

        const payload = {
            username: "Website Bot",
            avatar_url: "https://cdn.discordapp.com/embed/avatars/0.png",
            embeds: [embed]
        };

        try {
            const response = await fetch(DISCORD_WEBHOOK_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                return { success: true };
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        } catch (error) {
            console.error('Error sending to Discord:', error);
            return { success: false, error: error.message };
        }
    }
    

    const messageForm = document.querySelector('.message-form');
    if (messageForm) {
        messageForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();
            

            if (!name || !email || !message) {
                alert('Please fill in all fields.');
                return;
            }
            

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address.');
                return;
            }
            
            const sendBtn = this.querySelector('.send-btn');
            const originalText = sendBtn.textContent;
            const originalBg = sendBtn.style.background;
            

            sendBtn.textContent = 'Sending...';
            sendBtn.disabled = true;
            sendBtn.style.background = 'linear-gradient(135deg, #666666 0%, #888888 100%)';
            
            try {

                const result = await sendToDiscord(name, email, message);
                
                if (result.success) {

                    sendBtn.textContent = 'Message Sent! ✓';
                    sendBtn.style.background = 'linear-gradient(135deg, #28ca42 0%, #2dd55b 100%)';
                    

                    const terminalModal = document.getElementById('terminal-modal');
                    if (terminalModal && terminalModal.classList.contains('show')) {
                        addTerminalLine(`✓ Message sent to Discord from ${name} (${email})`);
                        addTerminalLine(`Message: ${message}`);
                    }
                    

                    setTimeout(() => {
                        this.reset();
                        sendBtn.textContent = originalText;
                        sendBtn.disabled = false;
                        sendBtn.style.background = originalBg || 'linear-gradient(135deg, #444444 0%, #666666 100%)';
                    }, 2500);
                    
                } else {
                    throw new Error(result.error || 'Failed to send message');
                }
                
            } catch (error) {

                sendBtn.textContent = 'Failed to Send ✗';
                sendBtn.style.background = 'linear-gradient(135deg, #ff4757 0%, #ff3838 100%)';
                

                const terminalModal = document.getElementById('terminal-modal');
                if (terminalModal && terminalModal.classList.contains('show')) {
                    addTerminalLine(`✗ Failed to send message: ${error.message}`);
                }
                

                setTimeout(() => {
                    sendBtn.textContent = originalText;
                    sendBtn.disabled = false;
                    sendBtn.style.background = originalBg || 'linear-gradient(135deg, #444444 0%, #666666 100%)';
                }, 3000);
                
                console.error('Message send error:', error);
            }
        });
        

        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const messageInput = document.getElementById('message');
        

        [nameInput, emailInput, messageInput].forEach(input => {
            if (input) {
                input.addEventListener('click', function(e) {
                    e.stopPropagation();
                    this.focus();
                });
                
                input.addEventListener('focus', function() {
                    this.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                });
                
                input.addEventListener('blur', function() {
                    if (this.value.trim() === '') {
                        this.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                    }
                });
            }
        });
        

        if (nameInput) {
            nameInput.addEventListener('input', function() {
                if (this.value.trim().length > 0) {
                    this.style.borderColor = 'rgba(40, 202, 66, 0.5)';
                } else {
                    this.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                }
            });
        }
        

        if (emailInput) {
            emailInput.addEventListener('input', function() {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (emailRegex.test(this.value.trim())) {
                    this.style.borderColor = 'rgba(40, 202, 66, 0.5)';
                } else if (this.value.trim().length > 0) {
                    this.style.borderColor = 'rgba(255, 71, 87, 0.5)';
                } else {
                    this.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                }
            });
        }
        

        if (messageInput) {
            messageInput.addEventListener('input', function() {
                if (this.value.trim().length > 0) {
                    this.style.borderColor = 'rgba(40, 202, 66, 0.5)';
                } else {
                    this.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                }
            });
        }
    }
    

    document.addEventListener('keydown', function(e) {

        if (e.key === 'Escape') {
            modals.forEach(modal => {
                if (modal.classList.contains('show')) {
                    closeModal(modal);
                }
            });
        }
        

        if ((e.metaKey || e.ctrlKey) && e.key >= '1' && e.key <= '3') {
            e.preventDefault();
            const appIndex = parseInt(e.key) - 1;
            const apps = ['portfolio', 'text', 'terminal'];
            if (apps[appIndex]) {
                openModal(apps[appIndex]);
            }
        }
        

        if ((e.metaKey || e.ctrlKey) && e.key === 'w') {
            e.preventDefault();
            modals.forEach(modal => {
                if (modal.classList.contains('show')) {
                    closeModal(modal);
                }
            });
        }
        

        if (e.code === 'Space' && e.target === document.body) {
            e.preventDefault();
            if (backgroundMusic.paused) {
                backgroundMusic.play();
                musicPlaying = true;
            } else {
                backgroundMusic.pause();
                musicPlaying = false;
            }
        }
    });
    
    console.log('Scarletts code pls dont steal!');
});
