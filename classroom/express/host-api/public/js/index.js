import HostForm from './components/HostForm.js';
import Modal from './components/Modal.js';
import Hosts from './lib/hosts.js';

Hosts.load();

HostForm.create();

Modal.create();
