export default () => useState<{ showError: boolean, message: string }>('errorStore', () => { return { showError: false, message: "Error" } });