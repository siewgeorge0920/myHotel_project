import Client from '../models/Client.js';
import Staff from '../models/Staff.js';

class CrmService {
  async resolveGuest(data) {
    let client = await Client.findOne({ email: data.guestEmail });

    if (!client) {
      client = new Client({
        client_id: `CUST-${Math.floor(Math.random() * 90000 + 10000)}`,
        name: `${data.guestFirstName} ${data.guestLastName}`.trim(),
        email: data.guestEmail,
        phone: data.guestPhone,
        address: data.guestAddress
      });
      await client.save();
    }
    return client;
  }

  async getRandomActiveStaff() {
    const staff = await Staff.find({ status: 'Active' });
    return staff.length > 0 ? staff[Math.floor(Math.random() * staff.length)].name : 'System';
  }
}

export default new CrmService();