import { handleRequest } from 'utils/apiHelpers';
import {
  searchProvidersByService,
  searchProviderById,
  findAvailabilitiesByDateRange,
} from 'api/home/bookingDialog/selectProvider';
import { searchOrganizationById } from 'api/home';
import { setOrgs } from 'reduxModules/home.actions';
import { setLoading } from '../bookingDialog.actions';

export const SET_PROVIDERS = 'HOME.BOOKING_DIALOG.SELECT_PROVIDER.SET_PROVIDERS';
export const SET_PROVIDER_TIMES_DETAIL = 'HOME.BOOKING_DIALOG.SELECT_PROVIDER.SET_PROVIDER_TIMES_DETAIL';

export const setProviders = payload => ({
  type: SET_PROVIDERS,
  payload,
});

export const setProviderTimesDetail = payload => ({
  type: SET_PROVIDER_TIMES_DETAIL,
  payload,
});

export const getProvidersByService = serviceId => async (dispatch, getState) => {
  dispatch(setLoading(true));

  const [rawProvidersService] = await handleRequest(searchProvidersByService, [serviceId], []);
  const response = await Promise.all(rawProvidersService.map(
    resp => handleRequest(searchProviderById, [resp.providerId]),
  ));
  const rawProviders = response.map(resp => resp[0]);
  const orgIds = [];
  const { home } = getState();
  rawProviders.forEach((provider) => {
    if (!orgIds.includes(provider.providerInformation.organizationId)
      && !home.orgs.find(org => org.id === provider.providerInformation.organizationId)) {
      orgIds.push(provider.providerInformation.organizationId);
    }
  });
  const result = await Promise.all(orgIds.map(orgId => handleRequest(searchOrganizationById, [orgId])));
  const orgs = result.map(rs => rs[0]).concat(home.orgs);
  const providers = rawProviders.map(
    provider => ({
      ...provider,
      organization: orgs.find(org => org.id === provider.providerInformation.organizationId),
      geoLocation: (rawProvidersService.find(rps => rps.providerId === provider.id) || {}).geoLocation,
    }),
  );

  dispatch(setLoading(false));
  dispatch(setProviders(providers));
  dispatch(setOrgs(orgs));
};

export const getProviderTimes = data => async (dispatch) => {
  dispatch(setLoading(true));

  const response = (await Promise.all(data.providers.map(provider => handleRequest(findAvailabilitiesByDateRange, [{
    serviceId: data.serviceId, providerId: provider.id, startSec: data.startSec, toSec: data.toSec,
  }])))).map(resp => resp[0]);

  const providerTimes = {};
  response.forEach((providerTime) => {
    providerTimes[providerTime[0].providerId] = [...providerTime];
  });

  dispatch(setProviderTimesDetail(providerTimes));
  dispatch(setLoading(false));
};
