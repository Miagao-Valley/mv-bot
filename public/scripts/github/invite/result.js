const countdownEl = document.getElementById('countdown');
const redirectEl = document.getElementById('redirect_url');

document.addEventListener('DOMContentLoaded', () => {
    if (countdownEl && redirectEl?.value) {
        let time = 2;
        const countInterval = setInterval(() => {
            if (time == 0) {
                clearInterval(countInterval);
                location.href = redirectEl.value;

                return;
            }

            countdownEl.innerHTML = `Redirecting in ${time}`;
            time--;
        }, 1000);
    }
});
