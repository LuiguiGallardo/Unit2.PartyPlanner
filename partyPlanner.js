const COHORT = "2109-CPU-RM-WEB-PT";
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}/events`;

const state = {
    events: [],
};

const eventList = document.querySelector("#events");

const addEventForm = document.querySelector("#addEvent");
addEventForm.addEventListener("submit", addEvent);

/**
 * Sync state with the API and rerender
 */
async function render() {
    await getEvents();
    renderEvents();
}
render();

/**
 * Update state with events from API
 */
async function getEvents() {
    try {
        const response = await fetch(API_URL);
        const json = await response.json();
        state.events = json.data;
    } catch (error) {
        console.error(error);
    }
}

/**
 * Render events from state
 */
function renderEvents() {
    if (!state.events.length) {
        eventList.innerHTML = "<li>No events.</li>";
        return;
    }

    const eventCards = state.events.map((event) => {
        const li = document.createElement("li");
        li.innerHTML = `
      <h3>Event name:\t${event.name}</h3>
      <p><b>Description:</b>\t${event.description}</p>
      <p><b>Date:</b>\t${event.date}</p>
      <p><b>Location:</b>\t${event.location}</p>
      <button onclick="deleteEvent('${event.id}')">Delete event</button>
    `;
        return li;
    });

    eventList.replaceChildren(...eventCards);
}

/**
 * Ask the API to create a new event based on form data
 * @param {Event} event
 */
async function addEvent(event) {
    event.preventDefault();

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: addEventForm.name.value,
                description: addEventForm.description.value,
                date: addEventForm.date.value,
                location: addEventForm.location.value,
            }),

        });
        if (!response.ok) {
            throw new Error("Failed to create event");
        }

        render();
    } catch (error) {
        console.error(error);
    }
}

/**
 * Ask the API to delete an event by ID
 * @param {string} eventId - The ID of the event to delete
 */
async function deleteEvent(eventId) {
    try {
        const response = await fetch(`${API_URL}/${eventId}`, {
            method: "DELETE",
        });

        if (!response.ok) {
            throw new Error("Failed to delete event");
        }

        render();
    } catch (error) {
        console.error(error);
    }
}
