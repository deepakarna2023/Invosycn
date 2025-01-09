interface ContactsModel {
  id: string;
  clientId: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: number | null;
}

export default ContactsModel;
