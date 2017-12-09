const uploadFile = (file) => {
  const baseUrl = 'http://localhost:3000'
  let formData = new FormData()
  formData.append('file', file)

  // fetch POST request to express server
  return fetch(baseUrl + '/file', {
    method: 'POST',
    body: formData,
  })
    .then(response => response.json()
      .then(json => ( {json, response} ))
    )
    .then(({json, response}) =>
      !response.ok ? Promise.reject(json) : json
    )
    .then(
      response => response,
      error => error
    )
}