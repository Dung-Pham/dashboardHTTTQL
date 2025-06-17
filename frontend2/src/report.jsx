<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Report Builder</title>
  <script src="https://cdn.jsdelivr.net/npm/react@18.2.0/umd/react.production.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/react-dom@18.2.0/umd/react-dom.production.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/@babel/standalone@7.20.6/babel.min.js"></script>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel">
    const { useState, useRef } = React;

    const initialDashboardCards = [
      { id: 'card1', title: 'Inventory Overview', src: 'http://dungpham/Reports/powerbi/InventoryDashboardRS?rs:Embed=true' },
      { id: 'card2', title: 'Sales Metrics', src: 'http://dungpham/Reports/powerbi/SalesDashboardRS?rs:Embed=true' },
    ];

    const ReportBuilder = () => {
      const [reportItems, setReportItems] = useState([]);
      const [isDragging, setIsDragging] = useState(false);
      const dragItem = useRef(null);
      const canvasRef = useRef(null);

      // Handle drag start for dashboard cards
      const handleDragStart = (e, card) => {
        dragItem.current = { type: 'dashboard', data: card };
        setIsDragging(true);
        e.dataTransfer.setData('text/plain', JSON.stringify(card));
      };

      // Handle drop on canvas
      const handleDrop = async (e) => {
        e.preventDefault();
        setIsDragging(false);
        const card = JSON.parse(e.dataTransfer.getData('text/plain'));
        
        // Simulate API call to get screenshot
        try {
          const response = await fetch('/api/generate-screenshot', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ src: card.src }),
          });
          const { imageUrl } = await response.json();
          
          setReportItems([...reportItems, {
            id: `item-${Date.now()}`,
            type: 'image',
            content: imageUrl,
            title: card.title,
          }]);
        } catch (error) {
          console.error('Error fetching screenshot:', error);
        }
      };

      // Handle adding text elements
      const addTextElement = (type) => {
        const newItem = {
          id: `item-${Date.now()}`,
          type: type,
          content: '',
        };
        setReportItems([...reportItems, newItem]);
      };

      // Handle text input change
      const updateTextContent = (id, content) => {
        setReportItems(reportItems.map(item =>
          item.id === id ? { ...item, content } : item
        ));
      };

      // Render content based on type
      const renderContent = (item) => {
        switch (item.type) {
          case 'image':
            return (
              <div className="border p-2 bg-gray-50">
                <h3 className="font-bold">{item.title}</h3>
                <img src={item.content} alt={item.title} className="w-full h-auto" />
              </div>
            );
          case 'title':
            return (
              <input
                type="text"
                value={item.content}
                onChange={(e) => updateTextContent(item.id, e.target.value)}
                className="w-full text-2xl font-bold border p-2"
                placeholder="Enter title"
              />
            );
          case 'subtitle1':
            return (
              <input
                type="text"
                value={item.content}
                onChange={(e) => updateTextContent(item.id, e.target.value)}
                className="w-full text-xl font-semibold border p-2"
                placeholder="Enter subtitle 1"
              />
            );
          case 'subtitle2':
            return (
              <input
                type="text"
                value={item.content}
                onChange={(e) => updateTextContent(item.id, e.target.value)}
                className="w-full text-lg font-medium border p-2"
                placeholder="Enter subtitle 2"
              />
            );
          case 'text':
            return (
              <textarea
                value={item.content}
                onChange={(e) => updateTextContent(item.id, e.target.value)}
                className="w-full border p-2"
                placeholder="Enter text"
                rows="4"
              />
            );
          default:
            return null;
        }
      };

      return (
        <div className="flex h-screen">
          {/* Sidebar with dashboard cards */}
          <div className="w-1/4 bg-gray-100 p-4 overflow-y-auto">
            <h2 className="text-lg font-bold mb-4">Dashboard Cards</h2>
            {initialDashboardCards.map(card => (
              <div
                key={card.id}
                draggable
                onDragStart={(e) => handleDragStart(e, card)}
                className="mb-4 p-2 bg-white border rounded cursor-move"
              >
                <iframe
                  title={card.title}
                  src={card.src}
                  className="w-full h-32"
                  frameBorder="0"
                />
                <p className="mt-2 text-sm">{card.title}</p>
              </div>
            ))}
          </div>

          {/* Main canvas */}
          <div
            ref={canvasRef}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className={`flex-1 p-4 ${isDragging ? 'bg-blue-50' : 'bg-white'}`}
          >
            <div className="mb-4 flex space-x-2">
              <button
                onClick={() => addTextElement('title')}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Add Title
              </button>
              <button
                onClick={() => addTextElement('subtitle1')}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Add Subtitle 1
              </button>
              <button
                onClick={() => addTextElement('subtitle2')}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Add Subtitle 2
              </button>
              <button
                onClick={() => addTextElement('text')}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Add Text
              </button>
            </div>

            {reportItems.length === 0 && (
              <div className="text-center text-gray-500">
                Drag dashboard cards here or add text elements
              </div>
            )}

            {reportItems.map((item, index) => (
              <div key={item.id} className="mb-4">
                {renderContent(item)}
                <div className="mt-2 flex space-x-2">
                  <button
                    onClick={() => addTextElement('title')}
                    className="px-2 py-1 bg-blue-500 text-white rounded text-sm"
                  >
                    Add Title
                  </button>
                  <button
                    onClick={() => addTextElement('subtitle1')}
                    className="px-2 py-1 bg-blue-500 text-white rounded text-sm"
                  >
                    Add Subtitle 1
                  </button>
                  <button
                    onClick={() => addTextElement('subtitle2')}
                    className="px-2 py-1 bg-blue-500 text-white rounded text-sm"
                  >
                    Add Subtitle 2
                  </button>
                  <button
                    onClick={() => addTextElement('text')}
                    className="px-2 py-1 bg-blue-500 text-white rounded text-sm"
                  >
                    Add Text
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    };

    ReactDOM.render(<ReportBuilder />, document.getElementById('root'));
  </script>
</body>
</html>