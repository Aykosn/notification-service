export const spaceCardSchema = (text, imageUrl) => {
  if (imageUrl) {
    const schema = {
      "text": text,
      "cardsV2": [
        {
          "card": {
            "sections": [
              {
                "widgets": [
                  {
                    "image": {
                      "imageUrl": imageUrl,
                      "altText": "Internal Image",
                    },
                  },
                  {
                    "buttonList": {
                      "buttons": [
                        {
                          "text": "View Image",
                          "onClick": {
                            "openLink": {
                              "url": imageUrl
                            }
                          }
                        }
                      ]
                    }
                  }
                ]
              }
            ]
          }
        }
      ]
    }
    return schema;
  }

  return { text: text };
}