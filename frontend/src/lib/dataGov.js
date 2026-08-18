import apiClient from '../api/client';

export async function getDataGovResources() {
  const response =
    await apiClient.dataGovResources();

  return response.data;
}

export async function getDataGovResource(
  resourceKey,
  params = {}
) {
  const response =
    await apiClient.dataGovResource(
      resourceKey,
      params
    );

  return response.data;
}

export async function getDataGovHealth() {
  const response =
    await apiClient.dataGovHealth();

  return response.data;
}

export async function getDataGovResourceRecords(
  resourceKey,
  params = {}
) {
  const data =
    await getDataGovResource(
      resourceKey,
      params
    );

  return Array.isArray(data?.records)
    ? data.records
    : [];
}

export const DATAGOV_FEATURES = {
  'Market Prices': true,
  'Soil Passport': true,
  'Fertilizer': true,
  'Pesticide Library': true,
  'Near Me': true,
  'Livestock': true,
  'Government Schemes': true,
  'Insurance': true,
  'Weather': true,
  'Crops': true,
  'Training': true,
  'Harvest': true,
  'Marketplace': true,
  'Speak to AgriSaathi': true,
};

export async function getDataGovFeatureResources(
  feature
) {
  try {
    const meta =
      await getDataGovResources();

    const resources =
      Array.isArray(meta?.resources)
        ? meta.resources
        : [];

    return resources.filter(
      (resource) =>
        resource.primary_feature === feature ||
        (
          resource.secondary_features || []
        ).includes(feature)
    );
  } catch {
    return [];
  }
}
