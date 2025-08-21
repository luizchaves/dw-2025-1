import HostForm from './components/HostForm.js';
import Modal from './components/Modal.js';
import * as LineChart from './components/LineChart.js';
import Hosts from './lib/hosts.js';
import Auth from './services/auth.js';

window.signout = Auth.signout;

if (Auth.isAuthenticated()) {
  Hosts.load();

  HostForm.create();

  Modal.create();

  LineChart.create('chart-line');
}
