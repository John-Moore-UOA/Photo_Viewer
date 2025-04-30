import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

function PhotoViewer() {
  const { collection } = useParams() // Get the selected collection from the URL
  const [images, setImages] = useState([])
  const [selectedImage, setSelectedImage] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true) // Set loading to true when collection changes
    fetch(`/api/collections/${collection}/images`)
      .then((response) => response.json())
      .then((data) => {
        setImages(data)
        setLoading(false) // Set loading to false after images are fetched
      })
      .catch((error) => {
        console.error('Error fetching images:', error)
        setLoading(false) // Set loading to false even if there's an error
      })
  }, [collection])

  const openModal = (image) => setSelectedImage(image)
  const closeModal = () => setSelectedImage(null)

  const handleImageLoad = (e, index) => {
    const img = e.target
    const isLandscape = img.naturalWidth > img.naturalHeight
    const ratio = img.naturalHeight / img.naturalWidth
    setImages((prevImages) => {
      const updatedImages = [...prevImages]
      updatedImages[index] = { src: img.src, isLandscape, ratio } // Preserve the src and add isLandscape
      return updatedImages
    })
  }

  return (
    <div>
      <h1>Photo Viewer - {collection}</h1>
      {loading ? (
        <p>Loading images...</p>
      ) : (
        <div className="image-collage" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
          gridAutoRows: '150px',
          gap: '5px'
        }}>
          {images.map((image, index) => {
            const isObj = typeof image !== 'string'
            const gridCol = isObj && image.isLandscape ? 'span 2' : 'span 1'
            const gridRow = isObj && image.ratio ? `span ${Math.ceil(image.ratio)}` : 'span 1'
            return (
              <img
                key={index}
                src={isObj ? image.src : image}
                alt={`Image ${index + 1}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  gridColumnEnd: gridCol,
                  gridRowEnd: gridRow
                }}
                onLoad={(e) => handleImageLoad(e, index)}
                onClick={() => openModal(isObj ? image.src : image)}
              />
            )
          })}
        </div>
      )}
      {selectedImage && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <img src={selectedImage} alt="Selected" style={{ width: '100%' }} />
            <button className="close-button" onClick={closeModal}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default PhotoViewer
