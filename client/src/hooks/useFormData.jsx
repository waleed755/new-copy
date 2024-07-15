import { useCallback } from "react";
import dayjs from "dayjs";
import { Form } from "antd";

const useFormData = (
  formData,
  setFormData,
  setSelectedServices,
  setCustomersName,
  selectedServices,
  setLoading,
  handleOnSubmit,
  handleDialogState,
  selectedProperty
) => {
    const [form] = Form.useForm();


  const handleFormSubmit = async (values) => {
    try {
      const newDataArray = [];

      const createNewArray = (selectedServices, formData) => {
        selectedServices?.forEach((id) => {
          const obj = {
            id: id,
            initialTimeMinutes: formData[`${id}_initialTimeMinutes`],
            initialTimeFees: formData[`${id}_initialTimeFees`],
            additionalTimeMinutes: formData[`${id}_additionalTimeMinutes`],
            additionalTimeFees: formData[`${id}_additionalTimeFees`],
          };

          newDataArray.push(obj);

          delete formData[`${id}_initialTimeMinutes`];
          delete formData[`${id}_initialTimeFees`];
          delete formData[`${id}_additionalTimeMinutes`];
          delete formData[`${id}_additionalTimeFees`];
        });

        return newDataArray;
      };

      const transformedServices = createNewArray(selectedServices, formData);
      const shouldAddAiData = !formData.aiID;
      const shouldAddStatusData = !formData.statusId;

      let aiValue, statusValue;

      if (shouldAddAiData || shouldAddStatusData) {
        aiValue = shouldAddAiData
          ? aiData?.find((item) => item.label === "No")?.value
          : formData.aiID;
        statusValue = shouldAddStatusData
          ? statusData?.find((item) => item.label === "Active")?.value
          : formData.statusId;
      } else {
        aiValue = formData.aiID;
        statusValue = formData.statusId;
      }

      formData.flatFeeService = transformedServices;
      if (!formData.propertyStartDate) {
        formData.propertyStartDate = dayjs();
      }
      formData.aiID = aiValue;
      formData.statusId = statusValue;
      formData._id = selectedProperty?._id || "";

      const updatedFormData = new FormData();
      updatedFormData.append("propertyData", JSON.stringify(formData));

      aiFilesData.forEach((file) => {
        updatedFormData.append("aiFiles", file);
      });
      keyImages.forEach((file) => {
        updatedFormData.append("keyImages", file);
      });

      await form.validateFields();
      setLoading(true);
      await handleOnSubmit(updatedFormData);
      setLoading(false);
      handleDialogState();
    } catch (error) {
      console.error("Form submission failed:", error);
      setLoading(false);
      throw error;
    }
  };

  const handleCustomerChange = useCallback(
    async (customerId) => {
      form.setFieldsValue({ branchId: undefined });
      setCustomersName(customerId);
      const pointOfContact = await getPropertyPointOfContactApi({
        data: { customerId: customerId },
      });
      if (pointOfContact.data.success) {
        const transformedData = pointOfContact?.data?.pointOfContacts?.map(
          (customer) => ({
            value: customer._id,
            label: customer.name,
          })
        );
        setPointOfContactData(transformedData);
      }
    },
    [form, setCustomersName, setPointOfContactData]
  );

  const handleSwitchChange = useCallback(
    (checked) => {
      setIsSwitchChecked(checked);
    },
    [setIsSwitchChecked]
  );

  const handleServiceSelect = useCallback(
    (selectedValues) => {
      setSelectedServices(selectedValues);
    },
    [setSelectedServices]
  );

  return {
    handleFormSubmit,
    handleCustomerChange,
    handleSwitchChange,
    handleServiceSelect,
  };
};

export default useFormData;
