import { BaseInvoiceService } from "../../services/baseServices/BaseInvoiceService";
import { Checkbox, CheckboxChangeEvent } from "primereact/checkbox";
import InvoiceItemModel from "../../models/InvoiceItemModel";
import React, { useEffect, useRef, useState } from "react";
import "../../assets/styles/AddCustomItemComponent.scss";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Tooltip } from "primereact/tooltip";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { BaseClientService } from "../../services/baseServices/BaseClientService";

interface ItemsListProps {
  onAddItem: (item: InvoiceItemModel) => void;
}

const AddCustomItemComponent: React.FC<ItemsListProps> = ({
  onAddItem,
}) => {
  const invoiceService = new BaseInvoiceService();
  const clientService = new BaseClientService();
  const [invoiceItemsList, setSystemInvoiceItems] = useState<InvoiceItemModel[]>([]);
  const [selectedItem, setSelectedItem] = useState<InvoiceItemModel | null>(
    null
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [isCustomItem, setIsCustomItem] = useState<boolean>(false);
  const [customItemName, setCustomItemName] = useState<string>("");
  const [customPrice, setCustomPrice] = useState<number | null>(null);
  const isStorybook = process.env.STORYBOOK === 'true';
  const toast = useRef<Toast>(null);

  useEffect(() => {
    getAllInvoices();
  }, []);

  const getAllInvoices = () => {
    clientService.getAllClients().then((data) => {
      const flattenedInvoiceItems = data
        .flatMap((client) =>
          (client.invoices || []).flatMap((invoice) =>
            (invoice.invoiceItemList || []).map((item) => ({
              ...item,
            }))
          )
        );
    
      setSystemInvoiceItems(flattenedInvoiceItems);
    });
  };

  const handleSelectItem = (e: { value: string }) => {
    const item =
      invoiceItemsList.find(
        (item: InvoiceItemModel) => item?.itemModel?.name === e.value
      ) || null;
    setSelectedItem(item ? { ...item } : null);
  };

  const handleCheckboxChange = (e: CheckboxChangeEvent) => {
    setIsCustomItem(!!e.checked);
    setSelectedItem(null);
    setCustomItemName("");
    setCustomPrice(null);
    setQuantity(1);
  };

  const handleAddItem = () => {
    
    if (isStorybook) {
      toast.current?.show({
        severity: "success",
        summary: "Success",
        detail: "Item added successfully!",
      });
    }
    else {
      if (
        (selectedItem && quantity) ||
        (isCustomItem && customItemName && customPrice && quantity)
      ) {
        const itemToAdd: InvoiceItemModel = selectedItem
          ? {
            ...selectedItem,
            quantity,
            createdDate: selectedItem.createdDate || new Date(),
          }
          : {
            id: crypto.randomUUID(),
            itemModel: {
              id: crypto.randomUUID(),
              name: customItemName,
              number: 0,
              price: customPrice as number,
            },
            quantity,
            createdDate: new Date(),
          };

        onAddItem(itemToAdd);
      }
    }
    setSelectedItem(null);
    setQuantity(1);
    setIsCustomItem(false);
    setCustomItemName("");
    setCustomPrice(null);
  };

  const isAddButtonDisabled = () => {
    if (isCustomItem) {
      return !customItemName || !customPrice || !quantity;
    }
    return !selectedItem || !quantity;
  };
  const preventDecimalInput = (e: { key: string; preventDefault: () => void; }) => {
    if (e.key === '.' || e.key === ',') {
      e.preventDefault();
    }
  };


  return (
    <div className="invoice-items-container">
      <Toast ref={toast} />
      <div className={isCustomItem ? "modal-textfield" : "modal-dropdown"}>
        {isCustomItem ? (
          <InputText
            placeholder="Custom Item Name"
            value={customItemName}
            onChange={(e) => setCustomItemName(e.target.value)}
            required
            style={{ width: "100%" }}
          />
        ) : (
          <Dropdown
            value={selectedItem ? selectedItem.itemModel.name : ""}
            options={(invoiceItemsList || []).map((item) => ({
              label: item?.itemModel?.name,
              value: item?.itemModel?.name,
            }))}
            onChange={(e) => handleSelectItem(e)}
            placeholder="Select Item"
            filter
            style={{ width: "100%" }}
            required
          />
        )}
      </div>

      <div className="input-row">
        <InputNumber
          placeholder="Price"
          value={
            isCustomItem ? customPrice : selectedItem?.itemModel.price ?? null
          }
          onValueChange={(e) => setCustomPrice(e.value ?? null)}
          minFractionDigits={2}
          disabled={!isCustomItem}
          required
          mode="currency" currency="USD" locale="en-US"
          className="price-input"
        />
        <InputNumber
          placeholder="Quantity"
          value={quantity}
          onValueChange={(e) => setQuantity(Math.trunc(e.value ?? 1 ))}
          required
          showButtons
          className="quantity-input"
          min={0}
          max={100}
          onKeyDown={(e) => preventDecimalInput(e)} 
        />
      </div>

      <div className="modal-checkbox-label">
        <label htmlFor="customItemCheckbox" style={{ marginRight: "0.5rem" }}>
          Custom Item
        </label>
        <Checkbox
          inputId="customItemCheckbox"
          checked={isCustomItem}
          onChange={(e) => handleCheckboxChange(e)}
        />
      </div>

      <div className="button-row">
        <Button
          label="Add"
          onClick={handleAddItem}
          disabled={isAddButtonDisabled()}
          className="add-button"
        />
        <Tooltip
          target=".sync-button"
          position="top"
          content="In order to enable this, please use the Settings > System Configuration to set up your System of Record"
        />
        <Button
          label="Sync with System"
          disabled
          className="sync-button"
          icon="pi pi-sync"
        />
      </div>
    </div>
  );
};

export default AddCustomItemComponent;
