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
                      "altText": "Internal Image"
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