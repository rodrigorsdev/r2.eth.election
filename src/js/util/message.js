export const setMessage = (
    $messageSuccess,
    $messageSuccessText,
    $messageDanger,
    $messageDangerText,
    type,
    message
) => {
    if (type === 'success') {
        $messageSuccess.style.display = '';
        $messageSuccessText.innerHTML = message;

        $messageDanger.style.display = 'none';
        $messageDangerText.innerHTML = '';
    } else if (type === 'danger') {
        $messageDanger.style.display = '';
        $messageDangerText.innerHTML = message;

        $messageSuccess.style.display = 'none';
        $messageSuccessText.innerHTML = '';
    }
};