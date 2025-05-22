import { hosts } from './data.js';

const hostsList = document.getElementById('hostsList');

function removeHostData(id) {
  const index = hosts.findIndex(host => host.id === id);

  hosts.splice(index, 1);
}

function createHostCard(host) {
    const hostCard = `
        <div class="col-md-4 mb-4">
          <div id="host-${host.id}" class="card host-card">
            <div class="card-body">
              <h5 class="card-title">${host.name}</h5>
              <h6 class="card-subtitle mb-2 text-muted">IP: ${host.ip}</h6>
              <p class="card-text">${host.description}</p>
              <div class="d-flex justify-content-between align-items-center">
                <span class="badge bg-${host.status ? 'success' : 'danger'}">
                  ${host.status ? 'Online': 'Offline'}
                </span>
                <button class="btn-remove-card btn btn-sm btn-outline-primary" data-id="${host.id}">
                  <i class="bi bi-trash"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
    `;

    hostsList.insertAdjacentHTML('beforeend', hostCard);

    const removeCardBtn = document.querySelector(`#host-${host.id} .btn-remove-card`);

    removeCardBtn.addEventListener('click', function() {
        // Remove the host from the data array
        removeHostData(host.id);

        // Remove the card from the DOM
        this.closest('.col-md-4').remove();
    });
}

function renderHostCards(hosts) {
    hosts.forEach((host) => {
        createHostCard(host);
    });
}

renderHostCards(hosts);
