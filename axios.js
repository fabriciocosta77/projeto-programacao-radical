const axios = require('axios');

// Substitua pela sua chave de API
const API_KEY = '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';

const sendMessageToChatGPT = async (message) => {
    try {
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-3.5-turbo', // ou 'gpt-4' '3.5-turbo'
                messages: [{ role: 'user', content: message }],
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${API_KEY}`,
                },
            }
        );
        
        console.log(response.data.choices[0].message.content);
        return (response.data.choices[0].message.content);
    } catch (error) {
        console.error('Resposta: Erro ao se comunicar com o ChatGPT:', error.message);
    }
};

// Exemplo de uso
sendMessageToChatGPT('Olá, ChatGPT! Como você está?');
