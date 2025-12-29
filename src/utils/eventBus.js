// Global event bus for communication between components
class EventBus {
  constructor() {
    this.events = {};
  }

  // Subscribe to an event
  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }

  // Unsubscribe from an event
  off(event, callback) {
    if (this.events[event]) {
      this.events[event] = this.events[event].filter((cb) => cb !== callback);
    }
  }

  // Emit an event
  emit(event, data) {
    if (this.events[event]) {
      this.events[event].forEach((callback) => callback(data));
    }
  }
}

// Create a single instance of the event bus
const eventBus = new EventBus();

// Define event types
export const EVENT_TYPES = {
  PROPERTIES_CHANGED: "properties_changed",
  AGENTS_CHANGED: "agents_changed",
  PROJECTS_CHANGED: "projects_changed",
  BUILDERS_CHANGED: "builders_changed",
  HOME_CONTENT_CHANGED: "home_content_changed",
  FAVORITES_CHANGED: "favorites_changed",
};

export default eventBus;
