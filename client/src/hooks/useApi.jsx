import { useState, useCallback } from "react";
import {
  getBranchApi,
  getCustomerNamesApi,
  getPropertyAIApi,
  getPropertyCategoryApi,
  getPropertyChargeAbleApi,
  getPropertyFlatFeeServiceApi,
  getPropertyKeysApi,
  getPropertyPointOfContactApi,
  getPropertyStatusApi,
  getPropertySubscriptionFeeApi,
  getPropertyTypeApi,
} from "../services/apiConstants";

const useApi = (selectedProperty) => {
  const [branches, setBranches] = useState(null);
  const [chargable, setChargeable] = useState(null);
  const [statusData, setStatusData] = useState(null);
  const [subscriptionsData, setSubscriptionsData] = useState(null);
  const [flatServiceFeeData, setFlatServiceFeeData] = useState(null);
  const [types, setTypes] = useState(null);
  const [categories, setCategories] = useState(null);
  const [aiData, setAIData] = useState(null);
  const [keysData, setKeysData] = useState(null);
  const [customersData, setCustomersData] = useState(null);
  const [pointOfContactData, setPointOfContactData] = useState(null);

  const fetchStatuses = useCallback(async () => {
    const response = await getPropertyStatusApi();
    if (response.data.success) {
      setStatusData(
        response.data.statuses.map((item) => ({
          value: item._id,
          label: item.value,
        }))
      );
    }
  }, []);

  const fetchChargeAbles = useCallback(async () => {
    const response = await getPropertyChargeAbleApi();
    if (response.data.success) {
      setChargeable(
        response.data.chargeAble.map((item) => ({
          value: item._id,
          label: item.value,
        }))
      );
    }
  }, []);

  const fetchSubscriptionFees = useCallback(async () => {
    const response = await getPropertySubscriptionFeeApi();
    if (response.data.success) {
      setSubscriptionsData(
        response.data.subscriptionFees.map((item) => ({
          value: item._id,
          label: item.value,
        }))
      );
    }
  }, []);

  const fetchFlatServiceFee = useCallback(async () => {
    const response = await getPropertyFlatFeeServiceApi();
    if (response.data.success) {
      setFlatServiceFeeData(
        response.data.flatFeeServices.map((item) => ({
          value: item._id,
          label: item.value,
        }))
      );
    }
  }, []);

  const fetchTypes = useCallback(async () => {
    const response = await getPropertyTypeApi();
    if (response.data.success) {
      setTypes(
        response.data.types.map((item) => ({
          value: item._id,
          label: item.value,
        }))
      );
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    const response = await getPropertyCategoryApi();
    if (response.data.success) {
      setCategories(
        response.data.categories.map((item) => ({
          value: item._id,
          label: item.value,
        }))
      );
    }
  }, []);

  const fetchAI = useCallback(async () => {
    const response = await getPropertyAIApi();
    if (response.data.success) {
      setAIData(
        response.data.ais.map((item) => ({
          value: item._id,
          label: item.value,
        }))
      );
    }
  }, []);

  const fetchKeys = useCallback(async () => {
    const response = await getPropertyKeysApi();
    if (response.data.success) {
      setKeysData(
        response.data.keys.map((item) => ({
          value: item._id,
          label: item.value,
        }))
      );
    }
  }, []);

  const fetchCustomers = useCallback(async () => {
    const response = await getCustomerNamesApi();
    if (response.data.success) {
      setCustomersData(
        response.data.customers.map((item) => ({
          value: item._id,
          label: item.accountName,
        }))
      );
    }
  }, []);

  const fetchBranches = useCallback(async () => {
    const response = await getBranchApi();
    if (response.data.success) {
      setBranches(response.data.branches);
    }
  }, []);

  const fetchAllData = useCallback(() => {
    fetchStatuses();
    fetchChargeAbles();
    fetchSubscriptionFees();
    fetchFlatServiceFee();
    fetchTypes();
    fetchCategories();
    fetchAI();
    fetchKeys();
    fetchCustomers();
    fetchBranches();
  }, [
    fetchStatuses,
    fetchChargeAbles,
    fetchSubscriptionFees,
    fetchFlatServiceFee,
    fetchTypes,
    fetchCategories,
    fetchAI,
    fetchKeys,
    fetchCustomers,
    fetchBranches,
  ]);

  return {
    branches,
    chargable,
    statusData,
    subscriptionsData,
    flatServiceFeeData,
    types,
    categories,
    aiData,
    keysData,
    customersData,
    pointOfContactData,
    fetchAllData,
  };
};

export default useApi;
