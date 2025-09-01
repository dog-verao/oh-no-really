export default function InspectorTestPage() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Inspector Test Page</h1>
      <p>This page is designed to test the element inspector functionality.</p>

      <div style={{ margin: '20px 0' }}>
        <h2>Test Elements</h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', margin: '20px 0' }}>
          {/* Test Cards */}
          <div className="test-card" style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
            <img src="https://via.placeholder.com/150" alt="Test Image" style={{ width: '100%', height: 'auto' }} />
            <h3>Product Card 1</h3>
            <p>This is a test product description with some text content.</p>
            <span className="chip" style={{ background: '#007bff', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}>
              Test Tag
            </span>
          </div>

          <div className="test-card" style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
            <img src="https://via.placeholder.com/150" alt="Test Image" style={{ width: '100%', height: 'auto' }} />
            <h3>Product Card 2</h3>
            <p>Another test product with different content and styling.</p>
            <span className="chip" style={{ background: '#28a745', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}>
              Another Tag
            </span>
          </div>

          <div className="test-card" style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
            <img src="https://via.placeholder.com/150" alt="Test Image" style={{ width: '100%', height: 'auto' }} />
            <h3>Product Card 3</h3>
            <p>Third test product to ensure multiple elements work correctly.</p>
            <span className="chip" style={{ background: '#dc3545', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}>
              Third Tag
            </span>
          </div>
        </div>

        {/* Test Buttons */}
        <div style={{ margin: '20px 0' }}>
          <h3>Test Buttons</h3>
          <button id="primary-btn" style={{ background: '#007bff', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', margin: '5px' }}>
            Primary Button
          </button>
          <button id="secondary-btn" style={{ background: '#6c757d', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', margin: '5px' }}>
            Secondary Button
          </button>
          <button id="success-btn" style={{ background: '#28a745', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', margin: '5px' }}>
            Success Button
          </button>
        </div>

        {/* Test Form */}
        <div style={{ margin: '20px 0' }}>
          <h3>Test Form</h3>
          <form>
            <div style={{ margin: '10px 0' }}>
              <label htmlFor="name">Name:</label>
              <input type="text" id="name" name="name" placeholder="Enter your name" style={{ marginLeft: '10px', padding: '5px' }} />
            </div>
            <div style={{ margin: '10px 0' }}>
              <label htmlFor="email">Email:</label>
              <input type="email" id="email" name="email" placeholder="Enter your email" style={{ marginLeft: '10px', padding: '5px' }} />
            </div>
            <div style={{ margin: '10px 0' }}>
              <label htmlFor="message">Message:</label>
              <textarea id="message" name="message" placeholder="Enter your message" style={{ marginLeft: '10px', padding: '5px', width: '200px', height: '100px' }}></textarea>
            </div>
            <button type="submit" style={{ background: '#007bff', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px' }}>
              Submit Form
            </button>
          </form>
        </div>

        {/* Test Navigation */}
        <div style={{ margin: '20px 0' }}>
          <h3>Test Navigation</h3>
          <nav style={{ background: '#f8f9fa', padding: '10px', borderRadius: '4px' }}>
            <a href="#" style={{ margin: '0 10px', textDecoration: 'none', color: '#007bff' }}>Home</a>
            <a href="#" style={{ margin: '0 10px', textDecoration: 'none', color: '#007bff' }}>About</a>
            <a href="#" style={{ margin: '0 10px', textDecoration: 'none', color: '#007bff' }}>Contact</a>
            <a href="#" style={{ margin: '0 10px', textDecoration: 'none', color: '#007bff' }}>Services</a>
          </nav>
        </div>

        {/* Test Data Attributes */}
        <div style={{ margin: '20px 0' }}>
          <h3>Elements with Data Attributes</h3>
          <div data-testid="test-element" data-component="card" style={{ border: '1px solid #ddd', padding: '10px', margin: '10px 0' }}>
            Element with data-testid and data-component attributes
          </div>
          <button data-action="save" data-target="form" style={{ background: '#28a745', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px' }}>
            Save with Data Attributes
          </button>
        </div>
      </div>

      <div style={{ margin: '20px 0', padding: '15px', background: '#f8f9fa', borderRadius: '4px' }}>
        <h3>Instructions</h3>
        <ol>
          <li>Load this page in the inspector by entering: <code>/inspector/test</code></li>
          <li>Click "Start Inspecting" to enable element selection</li>
          <li>Hover over elements to see them highlighted</li>
          <li>Click on elements to capture their selectors</li>
          <li>Check the sidebar to see captured elements</li>
        </ol>
      </div>
    </div>
  );
}
