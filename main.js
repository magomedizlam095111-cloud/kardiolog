const form = document.getElementById('appointmentForm');
const responseBlock = document.getElementById('aiResponse');

form.addEventListener('submit', function(event) {

    event.preventDefault();

    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const message = document.getElementById('message').value;

    responseBlock.style.display = 'block';

    responseBlock.innerHTML = `
        <strong>AI-ассистент:</strong><br><br>

        Спасибо, ${name}. Ваша заявка успешно принята.

        <br><br>

        Специалист свяжется с вами по номеру:
        <strong>${phone}</strong>

        <br><br>

        ${
            message
                ? `Ваш вопрос: "${message}"`
                : 'Вы не оставили дополнительный вопрос.'
        }
    `;

    form.reset();
});