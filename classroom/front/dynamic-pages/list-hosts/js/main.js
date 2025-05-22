import { hosts } from './data.js';

function createHostCard(host) {
    const hostCard = `
        <div class="col-md-4 mb-4">
          <div id="host-${host.id}" class="card host-card">
            <div class="card-body">
              <h5 class="card-title">${host.name}</h5>
              <h6 class="card-subtitle mb-2 text-muted">IP: ${host.ip}</h6>
              <p class="card-text">${host.description}</p>
              <div class="d-flex justify-content-between">
                <span class="badge bg-${host.status ? 'success' : 'danger'}">${host.status ? 'Online': 'Offline'}</span>
              </div>
            </div>
          </div>
        </div>
    `;

    return hostCard;
}

function renderHostCards(hosts) {
    const hostsList = document.getElementById('hostsList');

    hosts.forEach((host) => {
        const hostCard = createHostCard(host);
        hostsList.innerHTML += hostCard;
    });
}

renderHostCards(hosts);
