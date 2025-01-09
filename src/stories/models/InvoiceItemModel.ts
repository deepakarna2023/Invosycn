import ItemModel from "./ItemModel";

interface InvoiceItemModel {
  id: string;
  itemModel: ItemModel;
  quantity: number;
  createdDate: Date;
}

export default InvoiceItemModel;
