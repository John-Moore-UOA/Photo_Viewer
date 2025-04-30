import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Collections() {
  const [collections, setCollections] = useState([])
  const [previews, setPreviews] = useState({})
  const navigate = useNavigate()

  useEffect(() => {
    fetch('/api/collections')
      .then((response) => response.json())
      .then((data) => {
        setCollections(data)
        data.forEach((collection) => {
          fetch(`/api/collections/${collection}/images`)
            .then((response) => response.json())
            .then((images) => {
              if (images.length > 0) {
                setPreviews((prev) => ({ ...prev, [collection]: images[0] }))
              }
            })
            .catch((error) => console.error(`Error fetching images for ${collection}:`, error))
        })
      })
      .catch((error) => console.error('Error fetching collections:', error))
  }, [])

  const selectCollection = (collection) => {
    navigate(`/photos/${collection}`) // Navigate to the photo viewer page with the selected collection
  }

  return (
    <div>
      <h1>Collections</h1>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', // Dynamically fit items in rows
        gap: '1rem', // Add spacing between grid items
        justifyContent: 'center' // Center the grid items if there's extra space
      }}>
        {collections.map((collection, index) => (
          <div
            key={index}
            onClick={() => selectCollection(collection)}
            style={{
              cursor: 'pointer',
              width: '100%',
              paddingBottom: '100%', // Maintain square aspect ratio
              position: 'relative',
              backgroundColor: '#f0f0f0',
              overflow: 'hidden',
              borderRadius: '8px'
            }}
          >
            {previews[collection] && (
              <img
                src={previews[collection]}
                alt={collection}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            )}
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              color: 'white',
              textAlign: 'center',
              padding: '0.5rem',
              fontSize: '1rem'
            }}>
              {collection}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Collections
