import React, { useEffect, useState } from "react";
import {
  Modal,
  Button,
  Form,
  Input,
  Select,
  DatePicker,
  Row,
  Col,
  Divider,
  Upload,
  Switch,
  Image,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import {
  addPropertyAIApi,
  addPropertyCategoryApi,
  addPropertyKeysApi,
  addPropertyPointOfContactApi,
  addPropertyTypeApi,
  getBranchApi,
  getBranchesNamesWithActiveStatusApi,
  getCustomerNamesApi,
  getCustomerNamesWithActiveStatusApi,
  getPropertyAIApi,
  getPropertyCategoryApi,
  getPropertyChargeAbleApi,
  getPropertyFlatFeeServiceApi,
  getPropertyKeysApi,
  getPropertyPointOfContactApi,
  getPropertyStatusApi,
  getPropertySubscriptionFeeApi,
  getPropertyTypeApi,
} from "../../services/apiConstants";
import AddFieldModal from "./AddModal";
import { compressFile } from "../../Utils/Image";

const { Option } = Select;

const PropertyDialog = ({
  openDialog,
  handleDialogState,
  handleOnSubmit,
  selectedProperty,
}) => {

  const [form] = Form.useForm();
  const [formData, setFormData] = useState({});
  const [selectedServices, setSelectedServices] = useState([]);
  const [aiData, setAIData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [branches, setBranches] = useState(null);
  const [chargable, setChargeable] = useState(null);
  const [isSwitchChecked, setIsSwitchChecked] = useState(false);
  const [keyImages, setKeyImages] = useState(() => {
    return selectedProperty?.keyImages?.map((url, index) => ({
      uid: index.toString(),
      name: `file-${index}`,
      status: 'done',
      url: url,
      type: url.includes('.mp4') ? 'video/mp4' : 'image/*'
    })) || [];
  });
  const [aiFilesData, setAiFilesData] = useState(() => {
    return selectedProperty?.aiFiles?.map((url, index) => ({
      uid: index.toString(),
      name: `file-${index}`,
      status: 'done',
      url: url,
      type: url.includes('.mp4') ? 'video/mp4' : 'image/*'
    })) || [];
  });
  const [startValue, setStartValue] = useState(null);


  

  const handleKeyImagesChange = async (info) => {
    let newFileList = await Promise.all(
      info.fileList.map((file) => {
        if (file.originFileObj) {
          return compressFile(file.originFileObj);
        }
        return file;
      })
    );
    setKeyImages(newFileList);
  };

  const handleAiFilesChange = async (info) => {
    let newFileList = await Promise.all(
      info.fileList.map((file) => {
        if (file.originFileObj) {
          return compressFile(file.originFileObj);
        }
        return file;
      })
    );
    setAiFilesData(newFileList);
  };
  
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
      const aiFiles = [];
      const keyFiles = [];

      const updatedFormData = new FormData();

      console.log('aiFiles',aiFiles)
      aiFilesData.map(file => {

        if (file.originFileObj) {
          // New file to be uploaded
          updatedFormData.append("aiFiles", file.originFileObj);
        } else {
          console.log('aiFiles111',file)

          // Existing file URL
          aiFiles.push(file.url);
        }
      });
      keyImages.map(file => {

        if (file.originFileObj) {
          // New file to be uploaded
          updatedFormData.append("keyImages", file.originFileObj);
        } else {
          console.log('aiFiles111',file)

          // Existing file URL
          keyFiles.push(file.url);
        }
      });
      console.log('aiFiles---',aiFiles)

      formData.aiFileUrls=aiFiles;
      formData.keyFiles=keyFiles;

      formData.flatFeeService = transformedServices;
      if (!formData.propertyStartDate) {
        formData.propertyStartDate = dayjs();
      }
      formData.aiID = aiValue;
      formData.statusId = statusValue;
      formData._id = selectedProperty?._id || "";
  
      updatedFormData.append("propertyData", JSON.stringify(formData));
  
  
  
     
  
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
  
console.log('formData',formData)
  useEffect(() => {

    if (selectedProperty) {
      if(selectedProperty?.propertyAI?.value == 'Yes'){
        setShowUploader(true)
      }
      handleCustomerChange(selectedProperty?.customerId);
      setStartValue(dayjs(selectedProperty.propertyStartDate).format("DD-MM-YYYY"))
      setFormData({
        address: selectedProperty?.propertyAddress?.address || "",
        postCode: selectedProperty?.propertyAddress?.postCode || "",
        city: selectedProperty?.propertyAddress?.city || "",
        propertyStartDate: selectedProperty.propertyStartDate
          ? dayjs(selectedProperty.propertyStartDate)
          : null,
        propertyFinishDate: selectedProperty.propertyFinishDate
          ? dayjs(selectedProperty.propertyFinishDate)
          : null,
        branchId: selectedProperty.branchId
          ? selectedProperty.branchId.toString()
          : undefined,
        customerId: selectedProperty.customerId
          ? selectedProperty.customerId.toString()
          : undefined,
        subscriptionFeeId: selectedProperty.propertySubscriptionFee
          ? selectedProperty.propertySubscriptionFee?.id
          : undefined,
        statusId: selectedProperty.propertyStatus
          ? selectedProperty.propertyStatus.id
          : undefined,
        typeId: selectedProperty.propertyType
          ? selectedProperty.propertyType?.id
          : undefined,
        categoryId: selectedProperty.propertyCategory
          ? selectedProperty.propertyCategory?.id
          : undefined,
        keysId: selectedProperty.propertyKeys
          ? selectedProperty?.propertyKeys?.id
          : undefined,
        propertyType: selectedProperty.propertyType
          ? selectedProperty?.propertyType?.id
          : undefined,
        aiID: selectedProperty.propertyAI
          ? selectedProperty?.propertyAI?.id
          : undefined,
        pointOfContact: selectedProperty.propertyPointOfContact
          ? selectedProperty.propertyPointOfContact.map((contact) => contact.id)
          : [],
        flatFeeService:
          selectedProperty?.propertyFlatFeeServiceData?.map((service) => ({
            serviceId: service?.serviceId || "",
            initialTimeMinutes: service?.initialTimeMinutes || "",
            initialTimeFees: service?.initialTimeFees || "",
            additionalTimeMinutes: service?.additionalTimeMinutes || "",
            additionalTimeFees: service?.additionalTimeFees || "",
          })) || [],
        keyImages: selectedProperty.keyImages || [],
        aiFiles: selectedProperty.aiFiles || [],
        propertyInternalNotes: selectedProperty.propertyInternalNotes || "",
        propertyExternalNotes: selectedProperty.propertyExternalNotes || "",
        propertyKeyValue: selectedProperty.propertyKeyValue || "",
        propertyId: selectedProperty?.propertyId || "",
        propertyReference: selectedProperty?.propertyReference || "",
        propertyName: selectedProperty?.propertyName || "",
        propertyCreatedByUserName:
          selectedProperty?.propertyCreatedByUserName || "",
        propertyCreatedByUserId:
          selectedProperty?.propertyCreatedByUserId || "",
        companyId: selectedProperty?.companyId || "",
        companyName: selectedProperty?.companyName || "",
        branchName: selectedProperty?.branchName || "",
        customerName: selectedProperty?.customerName || "",
        propertyChargeable:
          selectedProperty?.propertyChargeable?.value === "Yes" ? true : false,
        propertySubscriptionFeeValue:
          selectedProperty?.propertySubscriptionFeeValue || "",
        aiNotes: selectedProperty?.aiNotes || "",
        propertyPhotos: selectedProperty?.propertyPhotos || [],
      });

      const initialValues = {
        ...selectedProperty,
        address: selectedProperty?.propertyAddress?.address || "",
        postCode: selectedProperty?.propertyAddress?.postCode || "",
        city: selectedProperty?.propertyAddress?.city || "",
        propertyStartDate: selectedProperty.propertyStartDate
          ? dayjs(selectedProperty.propertyStartDate)
          : null,
        propertyFinishDate: selectedProperty.propertyFinishDate
          ? dayjs(selectedProperty.propertyFinishDate)
          : null,
          aiID: selectedProperty.propertyAI
          ? selectedProperty?.propertyAI?.id
          : undefined,
        branchId: selectedProperty.branchId
          ? selectedProperty.branchId.toString()
          : undefined,
        customerId: selectedProperty.customerId
          ? selectedProperty.customerId.toString()
          : undefined,
        subscriptionFeeId: selectedProperty.propertySubscriptionFee
          ? selectedProperty.propertySubscriptionFee?.id
          : undefined,
        statusId: selectedProperty.propertyStatus
          ? selectedProperty.propertyStatus.id
          : undefined,
        typeId: selectedProperty.propertyType
          ? selectedProperty.propertyType?.id
          : undefined,
        categoryId: selectedProperty.propertyCategory
          ? selectedProperty.propertyCategory?.id
          : undefined,
    
        pointOfContact: selectedProperty.propertyPointOfContact
          ? selectedProperty.propertyPointOfContact.map((contact) => contact.id)
          : [],
        propertyChargeable:
          selectedProperty?.propertyChargeable?.value === "Yes" ? true : false,
        propertyFlatFeeService: selectedProperty.propertyFlatFeeServiceData
          ? selectedProperty.propertyFlatFeeServiceData.map(
              (service) => service?.serviceId
            )
          : [],
          keysId:selectedProperty.propertyKeys
          ? selectedProperty?.propertyKeys?.id
          : undefined,
        keyImages: selectedProperty.keyImages || [],
        aiFiles: selectedProperty.aiFiles || [],
        propertyInternalNotes: selectedProperty.propertyInternalNotes || "",
        propertyExternalNotes: selectedProperty.propertyExternalNotes || "",
        propertyKeyValue: selectedProperty.propertyKeyValue || "",
        aiNotes: selectedProperty.aiNotes || "",
        propertyPhotos: selectedProperty.propertyPhotos || [],
      };

      selectedProperty.propertyFlatFeeServiceData?.forEach((service) => {
        initialValues[`${service.serviceId}_initialTimeMinutes`] =
          service.initialTimeMinutes || 0;
        initialValues[`${service.serviceId}_initialTimeFees`] =
          service.initialTimeFees || 0;
        initialValues[`${service.serviceId}_additionalTimeMinutes`] =
          service.additionalTimeMinutes || 0;
        initialValues[`${service.serviceId}_additionalTimeFees`] =
          service.additionalTimeFees || 0;
      });

      form.setFieldsValue(initialValues);
      setSelectedServices(
        selectedProperty.propertyFlatFeeServiceData?.map(
          (service) => service?.serviceId
        )
      );
    } else {
      form.resetFields();
    }
  }, [selectedProperty, form]);

  const { user } = useSelector((state) => state.user);

  const [statusData, setStatusData] = useState(null);
  const [subscriptionsData, setSubscriptionsData] = useState(null);
  const [flatServiceFeeData, setFlatServiceFeeData] = useState(null);
  const [types, setTypes] = useState(null);
  const [categories, setCategories] = useState(null);
  const aiSelectData = [
    { label: "Yes", value: "Yes" },
    { label: "No", value: "No" },
  ];
  const [keysData, setKeysData] = useState(null);
  const [modalsVisible, setModalsVisible] = useState({});
  const [selectedField, setSelectedField] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [showUploader, setShowUploader] = useState(false);
  const [disableButton, setDisableButton] = useState(false);
  const [customersData, setCustomersData] = useState(null);
  const [customersName, setCustomersName] = useState(null);
  const [branchesData, setBranchesData] = useState(null);
  const [pointOfContactData, setPointOfContactData] = useState(null);
  const [tableData, setTableData] = useState([]);

  const handleAISelectChange = (value) => {
    form.setFieldsValue({ aiID: value });
    const currentValue = aiData?.find((item) => item.value === value)?.label;
    if (currentValue == "Yes") {
      setShowUploader(true);
    } else {
      setShowUploader(false);
    }
  };

  const getStatuses = async () => {
    try {
      const statuses = await getPropertyStatusApi();
      if (statuses.data.success) {
        const transformedData = statuses?.data?.statuses?.map((customer) => ({
          value: customer._id,
          label: customer.value,
        }));
        setStatusData(transformedData);
      }
    } catch (error) {
      console.error("Error fetching property statuses:", error);
    }
  };

  const getAllChargeAbles = async () => {
    try {
      const statuses = await getPropertyChargeAbleApi();
      if (statuses.data.success) {
        const transformedData = statuses?.data?.chargeAble?.map((customer) => ({
          value: customer._id,
          label: customer.value,
        }));
        setChargeable(transformedData);
      }
    } catch (error) {
      console.error("Error fetching property statuses:", error);
    }
  };

  const getSubscriptionFees = async () => {
    try {
      const subscription = await getPropertySubscriptionFeeApi();
      if (subscription.data.success) {
        const transformedData = subscription?.data?.subscriptionFees?.map(
          (customer) => ({
            value: customer._id,
            label: customer.value,
          })
        );
        setSubscriptionsData(transformedData);
      }
    } catch (error) {
      console.error("Error fetching subscription fees:", error);
    }
  };

  const getFlatServiceFee = async () => {
    try {
      const flatService = await getPropertyFlatFeeServiceApi();
      if (flatService.data.success) {
        const transformedData = flatService?.data?.flatFeeServices?.map(
          (customer) => ({
            value: customer._id,
            label: customer.value,
          })
        );

        setFlatServiceFeeData(transformedData);
      }
    } catch (error) {
      console.error("Error fetching flat service fee:", error);
    }
  };

  const handleFieldChange = (key, field, value) => {
    const updatedData = tableData.map((item) =>
      item.key === key ? { ...item, [field]: value } : item
    );
    setTableData(updatedData);
  };

  const getType = async () => {
    try {
      const type = await getPropertyTypeApi();
      if (type.data.success) {
        const transformedData = type?.data?.types?.map((customer) => ({
          value: customer._id,
          label: customer.value,
        }));
        setTypes(transformedData);
      }
    } catch (error) {
      console.error("Error fetching property types:", error);
    }
  };

  const fetchRows = async () => {
    try {
      const response = await getCustomerNamesApi();
      if (response.data.success) {
        const transformedData = response.data.customers.map((customer) => ({
          value: customer._id,
          label: customer.accountName,
        }));
        setCustomersData(transformedData);
      }
    } catch (error) {
      console.error("Error fetching customer names:", error);
    }
  };

  const getCategory = async () => {
    try {
      const category = await getPropertyCategoryApi();
      if (category.data.success) {
        const transformedData = category?.data?.categories?.map((customer) => ({
          value: customer._id,
          label: customer.value,
        }));
        setCategories(transformedData);
      }
    } catch (error) {
      console.error("Error fetching property categories:", error);
    }
  };

  const getAI = async () => {
    try {
      const ai = await getPropertyAIApi();
      if (ai.data.success) {
        const transformedData = ai?.data?.ais?.map((customer) => ({
          value: customer._id,
          label: customer.value,
        }));
        setAIData(transformedData);
      }
    } catch (error) {
      console.error("Error fetching property AI data:", error);
    }
  };

  const getKeys = async () => {
    try {
      const keys = await getPropertyKeysApi();
      if (keys.data.success) {
        const transformedData = keys?.data?.keys?.map((customer) => ({
          value: customer._id,
          label: customer.value,
        }));
        setKeysData(transformedData);
      }
    } catch (error) {
      console.error("Error fetching property keys:", error);
    }
  };

  const getPointOfContact = async (customerId) => {
    try {
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
    } catch (error) {
      console.error("Error fetching property point of contact:", error);
    }
  };

  const getBranchesData = async () => {
    try {
      const fetchRows = await getBranchApi();
      if (fetchRows.data.success) {
        setBranchesData(fetchRows.data.branches);
        if (selectedProperty) {
          const filteredBranchesData = fetchRows.data.branches?.filter(
            (item) => item?.customerId == selectedProperty?.customerId
          );
          const transformedData = filteredBranchesData?.map((branch) => ({
            value: branch._id,
            label: branch.branchName,
          }));
          setBranches(transformedData);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCustomerChange = async (customerId) => {
    form.setFieldsValue({ branchId: undefined });
    handleBranchClear();
    setCustomersName(customerId);
    getPointOfContact(customerId);
    setSelectedBranch(null);
    const filteredBranchesData = branchesData?.filter(
      (item) => item?.customerId == customerId
    );
    const transformedData = filteredBranchesData?.map((branch) => ({
      value: branch._id,
      label: branch.branchName,
    }));
    setBranches(transformedData);
  };

  useEffect(() => {
    getAllChargeAbles();
    fetchRows();
    getBranchesData();
    getStatuses();
    getSubscriptionFees();
    getFlatServiceFee();
    getType();
    getCategory();
    getAI();
    getKeys();
  }, []);

  const handleAddButtonClick = (fieldName) => {
    setSelectedField(fieldName);
    setModalsVisible({ ...modalsVisible, [fieldName]: true });
  };

  const handleModalCancel = () => {
    setModalsVisible({ ...modalsVisible, [selectedField]: false });
    setSelectedField(null);
  };

  const handleModalCreate = async (fieldName, value) => {
    setDisableButton(true);
    try {
      const apiFunctions = {
        propertyPointOfContact: addPropertyPointOfContactApi,
        propertyType: addPropertyTypeApi,
        propertyCategory: addPropertyCategoryApi,
        propertyAI: addPropertyAIApi,
        propertyKeys: addPropertyKeysApi,
      };
      const apiGetFunctions = {
        propertyPointOfContact: getPointOfContact,
        propertyType: getType,
        propertyCategory: getCategory,
        propertyAI: getAI,
        propertyKeys: getKeys,
      };
      const data = { data: { ...value, customerId: customersName } };

      if (fieldName in apiFunctions) {
        await apiFunctions[fieldName](data);
        await apiGetFunctions[fieldName](customersName);
      } else {
        console.error(`No API function found for field ${fieldName}`);
      }

      setModalsVisible({ ...modalsVisible, [fieldName]: false });
      setSelectedField(null);
      setDisableButton(false);
    } catch (error) {
      setDisableButton(false);
      console.error(`Error adding value for field ${fieldName}:`, error);
    }
  };

  const handleStartDateChange = (_, value) => {
    setStartValue(value);
    if (!selectedProperty) {
      form.setFieldsValue({
        propertyFinishDate: null,
      });
    }
  };

  const handleBranchClear = () => {
    setSelectedBranch(null);
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const preventMinus = (e) => {
    if (e.code === "Minus" || e.key == "e" || e.key == "E") {
      e.preventDefault();
    }
  };

  useEffect(() => {
    if (pointOfContactData && pointOfContactData.length > 0) {
      form.setFieldsValue({
        pointOfContact: [pointOfContactData[0].value],
      });
    }
  }, [pointOfContactData, form]);

  useEffect(() => {
    console.log('callled')
    form.setFieldsValue({
      propertyStartDate: dayjs(),
    });
    if(!selectedProperty){
    setStartValue(dayjs().format("DD-MM-YYYY"));

    }
  }, [form]);

  const renderStep1 = () => (
    <Row gutter={24} className="justify-between rounded-lg  p-3 border border-[#e5e5e5] mb-4">
      <Col span={24} className="text-base font-medium text-center text-[#000000OD] my-5">
        Branch Information
      </Col>
      <Col span={12}>
        <Form.Item
          label="Customer Name"
          name="customerId"
          rules={[{ required: true, message: "Please select customer" }]}
        >
          <Select
            filterOption={(input, option) => (option?.label?.toLowerCase() ?? "").includes(input?.toLowerCase())}
            showSearch
            options={customersData}
            onChange={handleCustomerChange}
          />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item
          label="Branch Name"
          name="branchId"
          rules={[{ required: true, message: "Please select branch" }]}
        >
          <Select
            filterOption={(input, option) => (option?.label?.toLowerCase() ?? "").includes(input?.toLowerCase())}
            showSearch
            allowClear
            value={selectedBranch}
            options={branches}
            onChange={(value) => setSelectedBranch(value)}
            onBlur={handleBranchClear}
          />
        </Form.Item>
      </Col>
    </Row>
  );

  const renderStep2 = () => (
    <Row gutter={24} className="justify-between rounded-lg  p-3 border border-[#e5e5e5] mb-4">
      <Col span={24} className="text-base font-medium text-center text-[#000000OD] my-5">
        Property Information
      </Col>
      <Col span={11}>
        <Form.Item label="Property ID" name="propertyId">
          <Input />
        </Form.Item>
      </Col>
      <Col span={11}>
        <Form.Item label="Property Reference" name="propertyReference">
          <Input />
        </Form.Item>
      </Col>
      <Col span={24}>
        <Form.Item
          label="Property Name"
          name="propertyName"
          rules={[{ required: true, message: "Please input Property Name!" }]}
        >
          <Input />
        </Form.Item>
      </Col>
    </Row>
  );

  const renderStep3 = () => (
    <Row gutter={24} className="rounded-lg  p-3 border border-[#e5e5e5] mb-4">
      <Col span={24}>
        <Col span={24} className="text-base font-medium text-center text-[#000000OD] my-5">
          Address
        </Col>
        <Form.Item label="Property Address" name="address">
          <Input />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item label="Property Postcode" name="postCode">
          <Input />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item label="Property City" name="city">
          <Input />
        </Form.Item>
      </Col>
    </Row>
  );

  const renderStep4 = () => (
    <Row gutter={24} className="justify-between rounded-lg  p-3 border border-[#e5e5e5] mb-4">
      <Col span={24} className="text-base font-medium text-center text-[#000000OD] my-5">
        Basic Details
      </Col>
      <Col span={12}>
        <Form.Item label="Property Type" name="typeId">
          <Select
            filterOption={(input, option) => (option?.label?.toLowerCase() ?? "").includes(input?.toLowerCase())}
            showSearch
            options={types}
            dropdownRender={(menu) => (
              <div>
                {menu}
                <Divider style={{ margin: "4px 0" }} />
                <div style={{ display: "flex", justifyContent: "flex-start", padding: "4px 8px" }}>
                  <Button type="text" onClick={() => handleAddButtonClick("propertyType")}>
                    + Add
                  </Button>
                </div>
              </div>
            )}
          />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item label="Property Category" name="categoryId">
          <Select
            filterOption={(input, option) => (option?.label?.toLowerCase() ?? "").includes(input?.toLowerCase())}
            showSearch
            options={categories}
            dropdownRender={(menu) => (
              <div>
                {menu}
                <Divider style={{ margin: "4px 0" }} />
                <div style={{ display: "flex", justifyContent: "flex-start", padding: "4px 8px" }}>
                  <Button type="text" onClick={() => handleAddButtonClick("propertyCategory")}>
                    + Add
                  </Button>
                </div>
              </div>
            )}
          />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item colon={false} label="Property Status" name="statusId">
          <Select placeholder="Active" options={statusData} />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item
          label="AI"
          name="aiID"
          rules={[{ required: false, message: "Please select AI" }]}
        >
          <Select
            filterOption={(input, option) => (option?.label ?? "").includes(input)}
            showSearch
            options={aiData}
            onChange={handleAISelectChange}
          />
        </Form.Item>
      </Col>
      {showUploader ? (
        <Col span={12}>
          <Form.Item name="aiFiles" label="Upload AI files">
          <Upload
  accept="image/*,video/mp4"
  fileList={aiFilesData}
  beforeUpload={() => false}
  onChange={handleAiFilesChange}
  onRemove={(file) => {
    const newFileList = aiFilesData.filter(item => item.uid !== file.uid);
    setAiFilesData(newFileList);
  }}
  multiple
  listType="picture-card"
>
  <div>
    <PlusOutlined /> Upload
  </div>
</Upload>
          </Form.Item>
        
        </Col>
      ) : (
        <></>
      )}
      <Col span={12}>
        <Form.Item label="AI Notes" name="aiNotes">
          <Input.TextArea />
        </Form.Item>
      </Col>
    </Row>
  );

  const renderStep5 = () => (
    <Row gutter={24} className="justify-between rounded-lg  p-3 border border-[#e5e5e5] mb-4 ">
      <Col span={24} className="text-base font-medium text-center text-[#000000OD] my-5">
        Dates
      </Col>
      <Col span={11}>
        <Form.Item
          rules={[{ required: true, message: "Please input Property Start Date!" }]}
          label="Property Start Date"
          name="propertyStartDate"
        >
          <DatePicker
            defaultValue={dayjs()}
            format={"DD-MM-YYYY"}
            onChange={(_, value) => handleStartDateChange("", value)}
            style={{ width: "100%" }}
          />
        </Form.Item>
      </Col>
      <Col span={11}>
        <Form.Item label="Property Finish Date" name="propertyFinishDate">
          <DatePicker
            format={"DD-MM-YYYY"}
            disabledDate={(current) => {
              console.log('start',startValue)
              return current && current < dayjs(startValue, "DD-MM-YYYY");
            }}
            style={{ width: "100%" }}
          />
        </Form.Item>
      </Col>
    </Row>
  );

  const renderStep6 = () => (
    <Row gutter={24} className="justify-between rounded-lg  p-3 border border-[#e5e5e5] mb-4">
      <Col span={24} className="text-base font-medium text-center text-[#000000OD] my-5">
        Point of Contact
      </Col>
      <Col span={24}>
        <Form.Item
          rules={[{ required: true, message: "Please add at least one point of contact" }]}
          label="Point of Contact"
          name="pointOfContact"
        >
          <Select
            showSearch
            options={pointOfContactData}
            mode="multiple"
            dropdownRender={(menu) => (
              <div>
                {menu}
                <Divider style={{ margin: "4px 0" }} />
                <div style={{ display: "flex", justifyContent: "flex-start", padding: "4px 8px" }}>
                  <Button type="text" onClick={() => handleAddButtonClick("propertyPointOfContact")}>
                    + Add
                  </Button>
                </div>
              </div>
            )}
          />
        </Form.Item>
      </Col>
    </Row>
  );

  const renderStep7 = () => (
    <Row gutter={24} className="rounded-lg  p-3 border border-[#e5e5e5] mb-4">
      <Col span={24} className="text-base font-medium text-center text-[#000000OD] my-5">
        Key Information
      </Col>
      <Col span={12}>
        <Form.Item
          label="Key Type"
          name="keysId"
          rules={[{ required: false, message: "Please select key type" }]}
        >
          <Select
            filterOption={(input, option) => (option?.label ?? "").includes(input)}
            showSearch
            options={keysData}
            dropdownRender={(menu) => (
              <div>
                {menu}
                <Divider style={{ margin: "4px 0" }} />
                <div style={{ display: "flex", justifyContent: "flex-start", padding: "4px 8px" }}>
                  <Button type="text" onClick={() => handleAddButtonClick("propertyKeys")}>
                    + Add
                  </Button>
                </div>
              </div>
            )}
          />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item
          label="Key Value"
          name="propertyKeyValue"
          rules={[{ required: false, message: "Please enter a key value" }]}
        >
          <Input placeholder="Enter Property Key value" />
        </Form.Item>
      </Col>
      <Col span={24}>
        <Form.Item name="keyImages" className="" label="Upload Key Images">
        <Upload
  accept="image/*,video/mp4"
  beforeUpload={() => false}

  fileList={keyImages}
  onChange={handleKeyImagesChange}
  onRemove={(file) => {
    const newFileList = keyImages.filter(item => item.uid !== file.uid);
    setKeyImages(newFileList);
  }}
  multiple
  listType="picture-card"
>
  <div>
    <PlusOutlined /> Upload
  </div>
</Upload>
        </Form.Item>
      </Col>
    </Row>
  );

  const renderStep8 = () => (
    <Row gutter={24} className="rounded-lg  p-3 border border-[#e5e5e5] mb-4">
      <Col span={24} className="text-base font-medium text-center text-[#000000OD] my-5">
        Additional Information
      </Col>
      <Col span={24}>
        <Form.Item
          label="Retainer"
          name="propertyChargeable"
          valuePropName="checked"
        >
          <Switch
            defaultChecked={
              selectedProperty?.propertyChargeable?.value == "Yes" ? true : false
            }
            checked={isSwitchChecked}
            onChange={handleSwitchChange}
            checkedChildren={
              chargable?.find((option) => option.label === "Yes")?.label
            }
            unCheckedChildren={
              chargable?.find((option) => option.label === "No")?.label
            }
          />
        </Form.Item>
      </Col>
      {isSwitchChecked && (
        <>
          <Col span={12}>
            <Form.Item
              rules={[{ required: true, message: "Please input subscription type" }]}
              label="Subscription Type"
              name="subscriptionFeeId"
            >
              <Select
                filterOption={(input, option) =>
                  (option?.label?.toLowerCase() ?? "").includes(
                    input?.toLowerCase()
                  )
                }
                showSearch
                options={subscriptionsData}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              rules={[{ required: true, message: "Please input subscription value" }]}
              label="Subscription Charges"
              name="propertySubscriptionFeeValue"
            >
              <Input min="0" onKeyDown={preventMinus} type="number" />
            </Form.Item>
          </Col>
        </>
      )}
      <Col span={12}>
        <Form.Item
          label="Internal Notes"
          name="propertyInternalNotes"
          rules={[{ required: false, message: "Please enter internal notes" }]}
        >
          <Input.TextArea placeholder="Enter internal notes" />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item
          label="External Notes"
          name="propertyExternalNotes"
          rules={[{ required: false, message: "Please enter external notes" }]}
        >
          <Input.TextArea placeholder="Enter external notes" />
        </Form.Item>
      </Col>
      <Col span={24}>
        <Form.Item
          label="Flat Fee Service"
          name="propertyFlatFeeService"
        >
          <Select
            filterOption={(input, option) =>
              (option?.label?.toLowerCase() ?? "").includes(input?.toLowerCase())
            }
            showSearch
            mode="multiple"
            options={flatServiceFeeData}
            onChange={handleServiceSelect}
          />
        </Form.Item>
        {selectedServices?.map((service) => (
          <Row key={service} gutter={16}>
            <Col span={7} className="flex items-center">
              <p className="text-base font-medium flex items-center">
                {`${flatServiceFeeData?.find((item) => item?.value === service)
                  ?.label
                  }`}
              </p>
            </Col>
            <Col span={4}>
              <Form.Item
                label="Initial Time (mins)"
                name={`${service}_initialTimeMinutes`}
                onKeyDown={preventMinus}
              >
                <Input min={0} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item
                label="Initial Time Fees"
                name={`${service}_initialTimeFees`}
                onKeyDown={preventMinus}
              >
                <Input min={0} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item
                label="Additional Time (mins)"
                name={`${service}_additionalTimeMinutes`}
                onKeyDown={preventMinus}
              >
                <Input min={0} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item
                label="Additional Time Fees"
                name={`${service}_additionalTimeFees`}
                onKeyDown={preventMinus}
              >
                <Input min={0} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>
        ))}
      </Col>
    </Row>
  );

  useEffect(() => {
    if (selectedProperty?.propertyChargeable?.value == "Yes") {
      setIsSwitchChecked(true);
    }
  }, []);

  useEffect(() => {
    const selectedOption = chargable?.find(
      (option) => option.label == (isSwitchChecked ? "Yes" : "No")
    );
    setFormData((prevFormData) => ({
      ...prevFormData,
      propertyChargeable: selectedOption?.value,
    }));
  }, [JSON.stringify(chargable), isSwitchChecked, JSON.stringify(formData)]);

  const handleSwitchChange = (checked) => {
    setIsSwitchChecked(checked);
  };

  const handleNext = () => {
    form.validateFields().then(() => {
      setCurrentStep(currentStep + 1);
    });
  };

  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleServiceSelect = (selectedValues) => {
    setSelectedServices(selectedValues);
  };
  useEffect(() => {
    const initialValues = selectedProperty
      ? formData
      : selectedServices.reduce((acc, service) => {
          acc[`${service}_initialTimeMinutes`] = 0;
          acc[`${service}_initialTimeFees`] = 0;
          acc[`${service}_additionalTimeMinutes`] = 0;
          acc[`${service}_additionalTimeFees`] = 0;
          return acc;
        }, {});

    form.setFieldsValue(initialValues);
  }, [ selectedServices]);

  return (
    <Modal
      width={"90%"}
      style={{ minHeight: "60vh" }}
      maskClosable={false}
      closable={false}
      open={openDialog}
      onCancel={handleDialogState}
      footer={[
        <Button key="cancel" onClick={handleDialogState}>
          Cancel
        </Button>,
        currentStep > 1 && (
          <Button key="prev" onClick={handlePrev}>
            Previous
          </Button>
        ),
        currentStep < 8 ? (
          <Button key="next" type="primary" onClick={handleNext}>
            Next
          </Button>
        ) : (
          <Button
            loading={loading}
            key="submit"
            type="primary"
            onClick={handleFormSubmit}
          >
            {selectedProperty ? "Update" : "Add"}
          </Button>
        ),
      ]}
    >
      <Form
        style={{ minHeight: "60vh" }}
        initialValues={
          selectedProperty
            ? formData
            : selectedServices.reduce((acc, service) => {
                acc[`${service}_initialTimeMinutes`] = 0;
                acc[`${service}_initialTimeFees`] = 0;
                acc[`${service}_additionalTimeMinutes`] = 0; 
                acc[`${service}_additionalTimeFees`] = 0;
                return acc;
              }, {})
        }
        onValuesChange={(values, allValues) => {
          setFormData((prevFormData) => ({
            ...prevFormData,
            ...allValues,
          }));
        }}
        form={form}
        layout="vertical"
      >
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}
        {currentStep === 5 && renderStep5()}
        {currentStep === 6 && renderStep6()}
        {currentStep === 7 && renderStep7()}
        {currentStep === 8 && renderStep8()}
      </Form>
      {selectedField && (
        <AddFieldModal
          currentfield={selectedField}
          visible={modalsVisible[selectedField]}
          onCreate={(value) => handleModalCreate(selectedField, value)}
          onCancel={handleModalCancel}
          disableButton={disableButton}
        />
      )}
    </Modal>
  );
};

export default PropertyDialog;
