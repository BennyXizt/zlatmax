

export async function phpmailerOnSubmit(event: Event) {
    event.preventDefault()

    const element = event.target as HTMLFormElement
    if (!element) return

    const body = new FormData(element)
    const method = element.getAttribute('method') || 'POST'

    try {
        const res = await fetch('/php/mail.php', {
            method,
            body
        })

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`)
        }

        const data = await res.json()
        console.log('Server response:', data)
    } catch (err) {
        console.error('Fetch or JSON error:', err)
    }
}
