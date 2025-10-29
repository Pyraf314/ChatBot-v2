/**
 * Advanced Chat Widget with Voice & File Upload
 * Version: 1.0.0
 * Repository: https://github.com/Pyraf314/ChatBot-v2
 */

(function() {
    'use strict';

    // Wait for config to be loaded
    if (typeof window.ChatWidgetConfig === 'undefined') {
        console.error('ChatWidgetConfig not found. Please include the configuration script first.');
        return;
    }

    const config = window.ChatWidgetConfig;

    // Inject CSS
    const style = document.createElement('style');
    style.textContent = `
        .chat-widget-container * {
            box-sizing: border-box;
        }
        
        #chat-widget-container {
            position: fixed;
            bottom: 20px;
            ${config.style.position}: 20px;
            width: 380px;
            height: 600px;
            background: ${config.style.backgroundColor};
            border-radius: 16px;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
            display: none;
            flex-direction: column;
            z-index: 999999;
            overflow: hidden;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        
        #chat-widget-container.active {
            display: flex;
        }
        
        #chat-widget-header {
            background: linear-gradient(135deg, ${config.style.primaryColor} 0%, ${config.style.secondaryColor} 100%);
            color: white;
            padding: 16px 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .chat-header-content {
            display: flex;
            align-items: center;
            gap: 12px;
            flex: 1;
        }
        
        .chat-logo {
            width: 40px;
            height: 40px;
            border-radius: 8px;
            object-fit: contain;
            background: white;
            padding: 4px;
        }
        
        .chat-brand-info {
            display: flex;
            flex-direction: column;
        }
        
        .chat-brand-name {
            font-weight: 600;
            font-size: 16px;
            line-height: 1.2;
        }
        
        .chat-status {
            font-size: 12px;
            opacity: 0.9;
            display: flex;
            align-items: center;
            gap: 6px;
        }
        
        .status-indicator {
            width: 8px;
            height: 8px;
            background: #4ade80;
            border-radius: 50%;
            animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }
        
        .close-btn {
            background: rgba(255, 255, 255, 0.2);
            border: none;
            color: white;
            width: 28px;
            height: 28px;
            border-radius: 6px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background 0.2s;
            font-size: 18px;
            flex-shrink: 0;
        }
        
        .close-btn:hover {
            background: rgba(255, 255, 255, 0.3);
        }
        
        #chat-widget-body {
            flex: 1;
            padding: 20px;
            overflow-y: auto;
            background: #f9fafb;
        }
        
        .message {
            margin-bottom: 16px;
            padding: 12px 16px;
            border-radius: 12px;
            font-size: 14px;
            word-wrap: break-word;
            max-width: 85%;
            animation: slideIn 0.3s ease;
            line-height: 1.5;
            clear: both;
            float: left;
        }
        
        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .user-message {
            background: ${config.style.primaryColor};
            color: white;
            float: right;
            border-bottom-right-radius: 4px;
        }
        
        .bot-message {
            background: white;
            color: ${config.style.fontColor};
            border: 1px solid #e5e7eb;
            border-bottom-left-radius: 4px;
            float: left;
        }
        
        .system-message {
            background: #fef3c7;
            color: #92400e;
            font-size: 13px;
            text-align: center;
            margin: 10px auto;
            max-width: 90%;
            float: none;
        }
        
        .welcome-message {
            background: white;
            border: 1px solid #e5e7eb;
            padding: 16px;
            border-radius: 12px;
            margin-bottom: 16px;
            float: none;
            max-width: 100%;
        }
        
        .welcome-message strong {
            display: block;
            margin-bottom: 8px;
            font-size: 16px;
            color: ${config.style.fontColor};
        }
        
        .welcome-message p {
            font-size: 14px;
            color: #6b7280;
            margin: 0;
        }
        
        .file-preview {
            background: #f3f4f6;
            padding: 8px 12px;
            border-radius: 8px;
            margin-top: 8px;
            font-size: 12px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        #chat-widget-footer {
            padding: 16px;
            border-top: 1px solid #e5e7eb;
            background: white;
        }
        
        #attached-files {
            margin-bottom: 8px;
        }
        
        .input-container {
            display: flex;
            gap: 8px;
            align-items: flex-end;
        }
        
        .input-wrapper {
            flex: 1;
            position: relative;
        }
        
        #chat-widget-input {
            width: 100%;
            padding: 12px 12px 40px 12px;
            border: 2px solid #e5e7eb;
            border-radius: 12px;
            outline: none;
            font-size: 14px;
            transition: border-color 0.2s;
            resize: none;
            max-height: 100px;
            font-family: inherit;
        }
        
        #chat-widget-input:focus {
            border-color: ${config.style.primaryColor};
        }
        
        .input-actions {
            position: absolute;
            right: 8px;
            bottom: 8px;
            display: flex;
            gap: 4px;
            z-index: 10;
        }
        
        .action-btn {
            background: transparent;
            border: none;
            cursor: pointer;
            font-size: 18px;
            padding: 4px 8px;
            border-radius: 6px;
            transition: background 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .action-btn:hover {
            background: #f3f4f6;
        }
        
        .action-btn.recording {
            color: #ef4444;
            animation: recordPulse 1s infinite;
        }
        
        @keyframes recordPulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
        }
        
        #chat-widget-send {
            background: ${config.style.primaryColor};
            color: white;
            border: none;
            padding: 12px;
            width: 44px;
            height: 44px;
            border-radius: 12px;
            cursor: pointer;
            font-weight: 600;
            transition: background 0.2s;
            flex-shrink: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
        }
        
        #chat-widget-send:hover {
            background: ${config.style.secondaryColor};
            filter: brightness(0.9);
        }
        
        #chat-widget-send:disabled {
            background: #d1d5db;
            cursor: not-allowed;
        }
        
        #chat-widget-button {
            position: fixed;
            bottom: 20px;
            ${config.style.position}: 20px;
            background: linear-gradient(135deg, ${config.style.primaryColor} 0%, ${config.style.secondaryColor} 100%);
            color: white;
            border: none;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 24px;
            z-index: 1000000;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 12px rgba(59, 136, 191, 0.4);
            transition: transform 0.2s;
        }
        
        #chat-widget-button:hover {
            transform: scale(1.05);
        }
        
        #chat-widget-button.hidden {
            display: none;
        }
        
        .typing-indicator {
            display: flex;
            gap: 4px;
            padding: 12px 16px;
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 12px;
            width: fit-content;
            margin-bottom: 16px;
            float: left;
        }
        
        .typing-dot {
            width: 8px;
            height: 8px;
            background: #9ca3af;
            border-radius: 50%;
            animation: typing 1.4s infinite;
        }
        
        .typing-dot:nth-child(2) {
            animation-delay: 0.2s;
        }
        
        .typing-dot:nth-child(3) {
            animation-delay: 0.4s;
        }
        
        @keyframes typing {
            0%, 60%, 100% {
                transform: translateY(0);
            }
            30% {
                transform: translateY(-10px);
            }
        }
        
        #file-input {
            display: none;
        }
        
        .attached-file {
            background: #ede9fe;
            border: 1px solid #c4b5fd;
            color: #6b21a8;
            padding: 8px 12px;
            border-radius: 8px;
            margin-bottom: 8px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 13px;
        }
        
        .remove-file {
            background: none;
            border: none;
            color: #6b21a8;
            cursor: pointer;
            font-size: 18px;
            padding: 0 4px;
            margin-left: 8px;
        }

        .clearfix::after {
            content: "";
            display: table;
            clear: both;
        }

        @media (max-width: 480px) {
            #chat-widget-container {
                width: calc(100% - 40px);
                height: calc(100% - 40px);
                bottom: 20px;
                ${config.style.position}: 20px;
            }
        }
    `;
    document.head.appendChild(style);

    // Create HTML structure
    const widgetHTML = `
        <button id="chat-widget-button">💬</button>

        <div id="chat-widget-container" class="chat-widget-container">
            <div id="chat-widget-header">
                <div class="chat-header-content">
                    ${config.branding.logo ? `<img src="${config.branding.logo}" alt="Logo" class="chat-logo">` : ''}
                    <div class="chat-brand-info">
                        <div class="chat-brand-name">${config.branding.name}</div>
                        <div class="chat-status">
                            <span class="status-indicator"></span>
                            <span>En ligne</span>
                        </div>
                    </div>
                </div>
                <button class="close-btn" id="close-btn">✖</button>
            </div>
            <div id="chat-widget-body" class="clearfix">
                <div class="welcome-message">
                    <strong>👋 Bonjour!</strong>
                    <p>${config.branding.welcomeText}</p>
                    ${config.branding.responseTimeText ? `<p style="margin-top: 8px; font-size: 12px; color: #9ca3af;">${config.branding.responseTimeText}</p>` : ''}
                </div>
            </div>
            <div id="chat-widget-footer">
                <div id="attached-files"></div>
                <div class="input-container">
                    <div class="input-wrapper">
                        <textarea 
                            id="chat-widget-input" 
                            placeholder="Tapez votre message..."
                            rows="1"
                        ></textarea>
                        <div class="input-actions">
                            <button class="action-btn" id="file-btn" title="Joindre un fichier">📎</button>
                            <button class="action-btn" id="voice-btn" title="Commande vocale">🎤</button>
                        </div>
                    </div>
                    <button id="chat-widget-send" title="Envoyer">➤</button>
                </div>
                <input type="file" id="file-input" multiple accept="image/*,.pdf,.doc,.docx,.txt">
            </div>
        </div>
    `;

    // Inject HTML
    const container = document.createElement('div');
    container.innerHTML = widgetHTML;
    document.body.appendChild(container);

    // Widget Logic
    let attachedFiles = [];
    let isRecording = false;
    let recognition = null;

    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'fr-FR';

        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript;
            document.getElementById('chat-widget-input').value = transcript;
            isRecording = false;
            document.getElementById('voice-btn').classList.remove('recording');
        };

        recognition.onerror = function(event) {
            console.error('Speech recognition error:', event.error);
            isRecording = false;
            document.getElementById('voice-btn').classList.remove('recording');
            addSystemMessage('Erreur de reconnaissance vocale. Veuillez réessayer.');
        };

        recognition.onend = function() {
            isRecording = false;
            document.getElementById('voice-btn').classList.remove('recording');
        };
    }

    function getChatId() {
        let chatId = sessionStorage.getItem("chatId");
        if (!chatId) {
            chatId = "chat_" + Math.random().toString(36).substr(2, 9);
            sessionStorage.setItem("chatId", chatId);
        }
        return chatId;
    }

    function addMessage(text, isUser = false) {
        const chatBody = document.getElementById('chat-widget-body');
        const clearDiv = document.createElement('div');
        clearDiv.className = 'clearfix';
        const message = document.createElement('div');
        message.className = isUser ? 'message user-message' : 'message bot-message';
        message.innerHTML = text;
        clearDiv.appendChild(message);
        chatBody.appendChild(clearDiv);
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    function addSystemMessage(text) {
        const chatBody = document.getElementById('chat-widget-body');
        const clearDiv = document.createElement('div');
        clearDiv.className = 'clearfix';
        const message = document.createElement('div');
        message.className = 'message system-message';
        message.textContent = text;
        clearDiv.appendChild(message);
        chatBody.appendChild(clearDiv);
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    function showTypingIndicator() {
        const chatBody = document.getElementById('chat-widget-body');
        const clearDiv = document.createElement('div');
        clearDiv.className = 'clearfix';
        clearDiv.id = 'typing-indicator-wrapper';
        const indicator = document.createElement('div');
        indicator.className = 'typing-indicator';
        indicator.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
        clearDiv.appendChild(indicator);
        chatBody.appendChild(clearDiv);
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    function hideTypingIndicator() {
        const wrapper = document.getElementById('typing-indicator-wrapper');
        if (wrapper) wrapper.remove();
    }

    function updateAttachedFilesDisplay() {
        const container = document.getElementById('attached-files');
        container.innerHTML = '';
        
        attachedFiles.forEach((file, index) => {
            const fileDiv = document.createElement('div');
            fileDiv.className = 'attached-file';
            fileDiv.innerHTML = `
                <span>📄 ${file.name} (${(file.size / 1024).toFixed(1)} KB)</span>
                <button class="remove-file" data-index="${index}">×</button>
            `;
            container.appendChild(fileDiv);
        });

        document.querySelectorAll('.remove-file').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                attachedFiles.splice(index, 1);
                updateAttachedFilesDisplay();
            });
        });
    }

    async function fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    async function sendMessage() {
        const input = document.getElementById('chat-widget-input');
        const message = input.value.trim();
        
        if (message === '' && attachedFiles.length === 0) return;

        const sendBtn = document.getElementById('chat-widget-send');
        sendBtn.disabled = true;

        let displayMessage = message;
        if (attachedFiles.length > 0) {
            displayMessage += `<div class="file-preview">
                <span>📎</span>
                <span>${attachedFiles.length} fichier(s) joint(s)</span>
            </div>`;
        }
        addMessage(displayMessage, true);

        input.value = '';
        input.style.height = 'auto';

        const filesData = await Promise.all(
            attachedFiles.map(async file => ({
                name: file.name,
                type: file.type,
                size: file.size,
                data: await fileToBase64(file)
            }))
        );

        const chatId = getChatId();
        showTypingIndicator();

        try {
            const response = await fetch(config.webhook.url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chatId: chatId,
                    message: message,
                    files: filesData,
                    route: config.webhook.route,
                    timestamp: new Date().toISOString()
                })
            });

            hideTypingIndicator();

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            addMessage(data.output || "Désolé, je n'ai pas pu comprendre.");
        } catch (error) {
            hideTypingIndicator();
            console.error('Error:', error);
            addMessage("Désolé, une erreur s'est produite. Veuillez réessayer.");
        }

        attachedFiles = [];
        updateAttachedFilesDisplay();
        sendBtn.disabled = false;
    }

    // Event Listeners
    document.getElementById('chat-widget-button').addEventListener('click', function() {
        document.getElementById('chat-widget-container').classList.add('active');
        this.classList.add('hidden');
    });

    document.getElementById('close-btn').addEventListener('click', function() {
        document.getElementById('chat-widget-container').classList.remove('active');
        document.getElementById('chat-widget-button').classList.remove('hidden');
    });

    document.getElementById('chat-widget-send').addEventListener('click', sendMessage);

    document.getElementById('chat-widget-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    document.getElementById('chat-widget-input').addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 100) + 'px';
    });

    document.getElementById('file-btn').addEventListener('click', function() {
        document.getElementById('file-input').click();
    });

    document.getElementById('file-input').addEventListener('change', function(e) {
        const files = Array.from(e.target.files);
        attachedFiles.push(...files);
        updateAttachedFilesDisplay();
        addSystemMessage(`${files.length} fichier(s) ajouté(s)`);
        e.target.value = '';
    });

    document.getElementById('voice-btn').addEventListener('click', function() {
        if (!recognition) {
            addSystemMessage('La reconnaissance vocale n\'est pas supportée par votre navigateur');
            return;
        }

        if (isRecording) {
            recognition.stop();
            isRecording = false;
            this.classList.remove('recording');
        } else {
            recognition.start();
            isRecording = true;
            this.classList.add('recording');
            addSystemMessage('À l\'écoute... Parlez maintenant');
        }
    });

})();
