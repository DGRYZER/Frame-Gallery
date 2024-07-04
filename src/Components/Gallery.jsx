import axios from "axios";
import React, { useEffect, useState } from "react";
import "./gallery.css";

const Popup = ({ message, onClose }) => (
  <div id="popup">
    <div className="popup-content">
      <p>{message}</p>
      <button onClick={onClose}>Close</button>
    </div>
  </div>
);

const Gallery = () => {
  const [content, setContent] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [albumIdSearch, setAlbumIdSearch] = useState("");
  const [idSearch, setIdSearch] = useState("");
  const [filteredContent, setFilteredContent] = useState([]);
  const [showAlbumIdPopup, setShowAlbumIdPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showNoRecordsPopup, setShowNoRecordsPopup] = useState(false);
  const [pageNumber, setPageNumber] = useState("");

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        let url =
          "https://jsonplaceholder.typicode.com/photos?_page=" + currentPage;
        if (albumIdSearch && idSearch) {
          url += `&albumId=${albumIdSearch}&id=${idSearch}`;
        } else if (idSearch) {
          setPopupMessage("Album ID is required.");
          setShowAlbumIdPopup(true);
          return;
        } else if (albumIdSearch) {
          url += `&albumId=${albumIdSearch}`;
        }
        const response = await axios.get(url);
        const responseData = response.data;
        if (responseData.length === 0) {
          setShowNoRecordsPopup(true);
          return;
        }
        setContent(responseData);
        setFilteredContent(responseData);
        const totalPages = Math.ceil(response.headers["x-total-count"] / 10);
        setTotalPages(totalPages);
      } catch (error) {
        console.log(error);
      }
    };

    if (searchQuery) {
      fetchPhotos();
    } else {
      fetchPhotos();
    }
  }, [currentPage, albumIdSearch, idSearch, searchQuery]);

  const handleNextPage = () => {
    if (currentPage < totalPages && !albumIdSearch && !idSearch) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1 && !albumIdSearch && !idSearch) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleGoToPage = () => {
    if (
      pageNumber >= 1 &&
      pageNumber <= totalPages &&
      !albumIdSearch &&
      !idSearch
    ) {
      setCurrentPage(pageNumber);
    }
  };

  const handlePhotoClick = (photo) => {
    setSelectedPhoto(photo);
  };

  const handleSearch = () => {
    setSearchQuery(`${albumIdSearch}&${idSearch}`);
  };

  const handleClear = () => {
    setAlbumIdSearch("");
    setIdSearch("");
    setSearchQuery("");
  };

  const handleclearpage = () => {
    setPageNumber("");
  };

  const renderPageNumbers = () => {
    const pageCount = [];
    const maxPageCount = 7;

    // Calculate the start and end page numbers to display
    let startPage = Math.max(1, currentPage - Math.floor(maxPageCount / 2));
    let endPage = Math.min(startPage + maxPageCount - 1, totalPages);

    // Adjust startPage if endPage is at the end of totalPages
    startPage = Math.max(1, endPage - maxPageCount + 1);

    for (let i = startPage; i <= endPage; i++) {
      if (
        i === 1 ||
        i === currentPage ||
        i === totalPages ||
        (i >= currentPage - 2 && i <= currentPage + 2)
      ) {
        pageCount.push(
          <span
            key={i}
            onClick={() => setCurrentPage(i)}
            className={i === currentPage ? "active" : ""}
            style={{ cursor: "pointer" }}
          >
            {i}
          </span>
        );
      } else if (
        (i === currentPage - 3 && currentPage > 4) ||
        (i === currentPage + 3 && currentPage < totalPages - 3)
      ) {
        pageCount.push(<span key={i}>...</span>);
      }
    }
    return pageCount;
  };

  return (
    <div id="home">
      {showAlbumIdPopup && (
        <Popup
          message={popupMessage}
          onClose={() => setShowAlbumIdPopup(false)}
        />
      )}
      {showNoRecordsPopup && (
        <Popup
          message="Sorry, No records found."
          onClose={() => setShowNoRecordsPopup(false)}
        />
      )}
      <div id="table">
        <input
          type="text"
          placeholder="Search by AlbumID..."
          id="search"
          value={albumIdSearch}
          onChange={(e) => setAlbumIdSearch(e.target.value)}
        />
        <input
          type="text"
          placeholder="Search by ID..."
          id="search"
          value={idSearch}
          onChange={(e) => setIdSearch(e.target.value)}
        />
        <button onClick={handleSearch} id="searchbtn1">
          Search
        </button>
        <button onClick={handleClear} id="clearbtn1">
          Clear
        </button>
        <br />
        <br />
        {!albumIdSearch && !idSearch && (
          <>
            <input
              type="number"
              placeholder="Enter Page Number"
              id="pageNumberInput"
              value={pageNumber}
              onChange={(e) => setPageNumber(e.target.value)}
            />
            <button onClick={handleGoToPage} id="gobtn1">
              Go
            </button>
            <button onClick={handleclearpage} id="clearbtn2">
              Clear
            </button>
          </>
        )}

        <table>
          <thead>
            <tr>
              <th>SL No.</th>
              <th>Album Id</th>
              <th>Id</th>
              <th>Title</th>
              <th>Thumbnail</th>
            </tr>
          </thead>
          <tbody>
            {filteredContent &&
              filteredContent.map((photo, index) => (
                <tr key={index}>
                  <td id="slno">{index + 1}</td>
                  <td>{photo.albumId}</td>
                  <td>{photo.id}</td>
                  <td
                    style={{ cursor: "pointer" }}
                    onClick={() => handlePhotoClick(photo)}
                  >
                    {photo.title}
                  </td>
                  <td>
                    <img src={photo.thumbnailUrl} alt={photo.title} />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <div id="pagination">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1 || albumIdSearch || idSearch}
        >
          Previous Page
        </button>
        <div id="pagecount">{renderPageNumbers()}</div>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages || albumIdSearch || idSearch}
        >
          Next Page
        </button>
      </div>

      {selectedPhoto && (
        <Popup
          message={
            <>
              <h2>Details of "{selectedPhoto.title}"</h2>
              <p style={{ marginTop: "25px" }}>
                <b>Album Id:</b> {selectedPhoto.albumId}
              </p>

              <p>
                <b>Id:</b> {selectedPhoto.id}
              </p>
              <p>
                <b>Title:</b> {selectedPhoto.title}
              </p>
              <p>
                <b>URL:</b> {selectedPhoto.url}
              </p>
              <p>
                <b>Thumbnail URL:</b> {selectedPhoto.thumbnailUrl}
              </p>
            </>
          }
          onClose={() => setSelectedPhoto(null)}
        />
      )}
    </div>
  );
};

export default Gallery;
