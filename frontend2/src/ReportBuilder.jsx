import React, { useState, useCallback, useRef } from 'react';
import './ReportBuilder.css';

const iframeSources = [
  { id: '1', title: 'Inventory Dashboard 1', src: 'http://dungpham/Reports/powerbi/InventoryDashboardRS?rs:Embed=true' },
  { id: '2', title: 'Inventory Dashboard 2', src: 'http://dungpham/Reports/powerbi/InventoryDashboardRS?rs:Embed=true' },
];

const ReportCanvas = ({ items, onSaveContent, onCancelContent, onEditContent, onDeleteContent, onSaveReport, onExportReport }) => {
  const reportContentRef = useRef(null);

  return (
    <div className="report-canvas">
      <div className="report-content" ref={reportContentRef}>
        {items.map((item, index) => (
          <div key={item.id} className="report-item">
            {item.isEditing ? (
              <div className="p-4 flex editing-container">
                <div className="w-1/3 pr-4">
                  <select
                    value={item.type}
                    onChange={(e) => onSaveContent(index, { ...item, type: e.target.value })}
                    className="p-2 border rounded w-full mb-2"
                  >
                    <option value="title">Tiêu đề</option>
                    <option value="subtitle1">Tiêu đề 1</option>
                    <option value="subtitle2">Tiêu đề 2</option>
                    <option value="text">Văn bản</option>
                    <option value="dashboard">Biểu đồ</option>
                    <option value="table">Bảng</option>
                  </select>
                  {item.type === 'dashboard' && (
                    <select
                      value={item.layout || 'default'}
                      onChange={(e) => onSaveContent(index, { ...item, layout: e.target.value })}
                      className="p-2 border rounded w-full mb-2"
                    >
                      <option value="default">Mặc định</option>
                      <option value="grid">Grid (Văn bản & Ảnh)</option>
                    </select>
                  )}
                  {item.type === 'table' && (
                    <div className="mt-2">
                      <input
                        type="number"
                        value={item.rows || 2}
                        onChange={(e) => onSaveContent(index, { ...item, rows: parseInt(e.target.value) || 2 })}
                        min="1"
                        placeholder="Số hàng"
                        className="p-2 border rounded w-full mb-2"
                      />
                      <input
                        type="number"
                        value={item.cols || 2}
                        onChange={(e) => onSaveContent(index, { ...item, cols: parseInt(e.target.value) || 2 })}
                        min="1"
                        placeholder="Số cột"
                        className="p-2 border rounded w-full mb-2"
                      />
                    </div>
                  )}
                </div>
                <div className="w-2/3">
                  {item.type !== 'dashboard' && item.type !== 'table' && (
                    <input
                      type="text"
                      value={item.content || ''}
                      onChange={(e) => onSaveContent(index, { ...item, content: e.target.value })}
                      placeholder="Nhập nội dung..."
                      className="p-2 border rounded w-full"
                    />
                  )}
                  {item.type === 'dashboard' && item.selectedDashboardSrc && (
                    <div className="mt-2">
                      <input
                        type="text"
                        value={item.content || ''}
                        onChange={(e) => onSaveContent(index, { ...item, content: e.target.value })}
                        placeholder="Mô tả cho dashboard (hiển thị trong grid)"
                        className="p-2 border rounded w-full mb-2"
                      />
                      <img
                        src={item.selectedDashboardSrc}
                        alt="Dashboard preview"
                        className="w-full h-auto border rounded dashboard-img"
                      />
                    </div>
                  )}
                  {item.type === 'table' && item.rows && item.cols && (
                    <div className="table-editor">
                      {Array.from({ length: item.rows }, (_, rowIdx) => (
                        <div key={rowIdx} className="table-row">
                          {Array.from({ length: item.cols }, (_, colIdx) => {
                            const cellKey = `${rowIdx}-${colIdx}`;
                            return (
                              <input
                                key={cellKey}
                                type="text"
                                value={item.tableData?.[rowIdx]?.[colIdx] || ''}
                                onChange={(e) => {
                                  const newTableData = [...(item.tableData || Array(item.rows).fill().map(() => Array(item.cols).fill('')))];
                                  if (!newTableData[rowIdx]) newTableData[rowIdx] = [];
                                  newTableData[rowIdx][colIdx] = e.target.value;
                                  onSaveContent(index, { ...item, tableData: newTableData });
                                }}
                                className="p-2 border rounded w-full mb-2 mr-2"
                              />
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex gap-2 justify-end mt-2 w-full">
                  <button
                    onClick={() => onSaveContent(index, { ...item, isEditing: false })}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Lưu
                  </button>
                  <button
                    onClick={() => onCancelContent(index)}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Hủy
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-start">
                <div className="flex-1 content-container">
                  {item.type === 'dashboard' ? (
                    <div className={item.layout === 'grid' ? 'grid-layout' : ''}>
                      <div className="text-sm mb-2">
                        {item.selectedDashboardId
                          ? iframeSources.find((d) => d.id === item.selectedDashboardId)?.title
                          : 'Dashboard'}
                      </div>
                      {item.layout === 'grid' && item.content && (
                        <div className="grid-content">
                          <div className="grid-text">{item.content}</div>
                          <div className="grid-image">
                            <img
                              src={item.selectedDashboardSrc}
                              alt="Dashboard preview"
                              className="dashboard-img"
                            />
                          </div>
                        </div>
                      )}
                      {item.layout !== 'grid' && (
                        <img
                          src={item.selectedDashboardSrc}
                          alt="Dashboard preview"
                          className="w-full h-auto border rounded dashboard-img"
                        />
                      )}
                      <p className="text-sm text-gray-600">Link: {item.originalDashboardSrc}</p>
                    </div>
                  ) : item.type === 'table' && item.tableData ? (
                    <div className="table-content">
                      <table className="report-table">
                        <thead>
                          <tr>
                            {item.tableData[0].map((header, idx) => (
                              <th key={idx}>{header}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {item.tableData.slice(1).map((row, rowIdx) => (
                            <tr key={rowIdx}>
                              {row.map((cell, cellIdx) => (
                                <td key={cellIdx} className={cellIdx === row.length - 1 ? 'right-italic-small' : ''}>
                                  {cellIdx === 0 ? <em>{cell}</em> : cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className={`text-content ${item.type}`}>
                      {item.type === 'title' && <h1>{item.content}</h1>}
                      {item.type === 'subtitle1' && <h2>{item.content}</h2>}
                      {item.type === 'subtitle2' && <h3>{item.content}</h3>}
                      {item.type === 'text' && <p>{item.content}</p>}
                    </div>
                  )}
                </div>
                <div className="action-buttons">
                  <button
                    onClick={() => onEditContent(index, { ...item, isEditing: true })}
                    className="action px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm('Bạn có chắc muốn xóa mục này?')) {
                        onDeleteContent(index);
                      }
                    }}
                    className="action px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="mt-4 flex gap-2">
        <button
          onClick={() => onSaveReport(reportContentRef)}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Lưu
        </button>
        <button
          onClick={onExportReport}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Xuất báo cáo
        </button>
      </div>
    </div>
  );
};

const ReportBuilder = () => {
  const [reportItems, setReportItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddContent = useCallback(
    (type) => {
      const newItem = {
        id: `${type}-${Date.now()}`,
        type: type,
        content: type === 'table' ? '' : '',
        selectedDashboardId: '',
        selectedDashboardSrc: '',
        originalDashboardSrc: '',
        layout: 'default',
        isEditing: true,
        rows: type === 'table' ? 2 : undefined,
        cols: type === 'table' ? 2 : undefined,
        tableData: type === 'table' ? Array(2).fill().map(() => Array(2).fill('')) : undefined,
      };
      setReportItems([...reportItems, newItem]);
    },
    [reportItems]
  );

  const handleAddDashboard = useCallback(
    async (dashboard) => {
      setIsLoading(true);
      try {
        const response = await fetch('http://localhost:3000/api/capture-dashboard', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: dashboard.src }),
        });

        if (!response.ok) throw new Error('Lỗi khi chụp ảnh dashboard');

        const { imageBase64 } = await response.json();

        const newItem = {
          id: `dashboard-${Date.now()}`,
          type: 'dashboard',
          content: '',
          selectedDashboardId: dashboard.id,
          selectedDashboardSrc: `data:image/png;base64,${imageBase64}`,
          originalDashboardSrc: dashboard.src,
          layout: 'default',
          isEditing: true,
        };

        setReportItems([...reportItems, newItem]);
      } catch (error) {
        console.error('Lỗi khi thêm dashboard:', error);
        alert('Không thể thêm dashboard!');
      } finally {
        setIsLoading(false);
      }
    },
    [reportItems]
  );

  const handleSaveContent = useCallback(
    (index, updatedItem) => {
      const items = [...reportItems];
      items[index] = updatedItem;
      setReportItems(items);
    },
    [reportItems]
  );

  const handleCancelContent = useCallback(
    (index) => {
      const items = [...reportItems];
      items.splice(index, 1);
      setReportItems(items);
    },
    [reportItems]
  );

  const handleEditContent = useCallback(
    (index, updatedItem) => {
      const items = [...reportItems];
      items[index] = updatedItem;
      setReportItems(items);
    },
    [reportItems]
  );

  const handleDeleteContent = useCallback(
    (index) => {
      const items = [...reportItems];
      items.splice(index, 1);
      setReportItems(items);
    },
    [reportItems]
  );

  const handleSaveReport = useCallback((reportContentRef) => {
    if (!reportContentRef.current) return;

    const content = reportContentRef.current.cloneNode(true);
    const actionButtons = content.querySelectorAll('.action-buttons');
    const editingContainers = content.querySelectorAll('.editing-container');
    actionButtons.forEach((el) => el.remove());
    editingContainers.forEach((el) => el.remove());

    const contentHtml = content.outerHTML;

    const fullHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Báo Cáo</title>
        <link rel="stylesheet" href="http://localhost:3000/public/report.css">
      </head>
      <body>
        ${contentHtml}
      </body>
      </html>
    `;
    console.log('HTML gửi tới backend:', fullHtml);

    fetch('http://localhost:3000/api/save-report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ html: fullHtml }),
    })
      .then((response) => {
        if (!response.ok) throw new Error('Lỗi khi lưu báo cáo');
        return response.blob();
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'report.pdf';
        a.click();
        window.URL.revokeObjectURL(url);
        alert('Báo cáo PDF đã được tải xuống!');
      })
      .catch((error) => {
        console.error('Lỗi khi lưu báo cáo:', error);
        alert('Lưu báo cáo thất bại!');
      });
  }, []);

  const handleExportReport = useCallback(() => {
    alert('Chức năng xuất báo cáo chưa được cập nhật!');
  }, []);

  return (
    <div className="report-builder">
      <div className="container">
        <div className="sidebar relative">
          <h3 className="text-lg font-bold mb-4">Dashboards</h3>
          {isLoading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
              <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 animate-spin"></div>
            </div>
          )}
          {iframeSources.map((dashboard) => (
            <div key={dashboard.id} className="dashboard-item mb-4">
              <div className="text-sm mb-2">{dashboard.title}</div>
              <iframe
                title={dashboard.title}
                width="100%"
                height="100"
                src={dashboard.src}
                frameBorder="0"
                allowFullScreen="true"
              />
              <button
                onClick={() => handleAddDashboard(dashboard)}
                className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 w-full disabled:opacity-50"
                disabled={isLoading}
              >
                Thêm {dashboard.title}
              </button>
            </div>
          ))}
        </div>
        <div className="main-content">
          <div className="controls">
            <button
              onClick={() => handleAddContent('text')}
              className="mr-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Thêm văn bản
            </button>
            <button
              onClick={() => handleAddContent('table')}
              className="mr-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Thêm bảng
            </button>
          </div>
          <ReportCanvas
            items={reportItems}
            onSaveContent={handleSaveContent}
            onCancelContent={handleCancelContent}
            onEditContent={handleEditContent}
            onDeleteContent={handleDeleteContent}
            onSaveReport={handleSaveReport}
            onExportReport={handleExportReport}
          />
        </div>
      </div>
    </div>
  );
};

export default ReportBuilder;