const API_URL = 'https://api.dev.oiwarren.com/api/'

const fetchMessage = async (lastMessage, answers = {}) => {
    try {
        const response = await fetch(`${API_URL}v2/conversation/message`, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: lastMessage,
                "answers": answers,
                "context": "suitability"
            })
        })
        return response.json();
    } catch (e) {
        alert(e)
    }
}
const getProfile = async (answers = {}) => {
    try {
        const response = await fetch(`${API_URL}v2/suitability/finish`, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "answers": answers,
            })
        })
        return response.json();
    } catch (e) {
        alert(e)
    }
}

export {fetchMessage, getProfile}