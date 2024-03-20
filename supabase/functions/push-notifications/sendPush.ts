export function sendPush() {
  // OneSignal API URL
  const oneSignalApiUrl = 'https://onesignal.com/api/v1/notifications'

  // Your OneSignal App ID and REST API Key
  const oneSignalAppId = Deno.env.get('ONESIGNAL_APP_ID')
  const oneSignalRestApiKey = Deno.env.get('ONESIGNAL_REST_API_KEY')

  // Notification content
  const notificationContent = {
    app_id: oneSignalAppId,
    included_segments: ['All'], // Target all users
    headings: { en: 'Notification Title' },
    contents: { en: 'Notification Message' },
    // Add any other notification parameters as needed
  }

  // Set up the request options
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      Authorization: `Basic ${oneSignalRestApiKey}`,
    },
    body: JSON.stringify(notificationContent),
  }

  try {
    const response = await fetch(oneSignalApiUrl, requestOptions)
    const data = await response.json()

    // Check if the notification was sent successfully
    if (response.ok) {
      console.log('Notification sent successfully:', data)
      res.status(200).json({ message: 'Notification sent successfully' })
    } else {
      console.error('Failed to send notification:', data)
      res.status(500).json({ error: 'Failed to send notification' })
    }
  } catch (err) {
    console.error(err)
  }
}
