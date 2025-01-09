import axiosInstance from '../axiosConfiguration';
import CompanySetting from '../../models/CompanyModel';
import { IBaseCommonService } from '../interfaces/IBaseCommonService';
import Person from '../../models/PersonModel';


export class BaseCommonService implements IBaseCommonService {

  async getCompanyDetails(userEmail: string): Promise<CompanySetting | null> {
    try {
      const response = await axiosInstance.get<CompanySetting[]>(`/getCompanyDetails?email=${userEmail}`);
      return response.data.length > 0 ? response.data[0] : null;
    } catch (error) {
      throw error;
    }
  }
  async getPersonDetailByCompany(companyId: string): Promise<Person | null> {
    try {
      const response = await axiosInstance.get<Person[]>(`/getPersonDetails?companyId=${companyId}`);
      return response.data.length > 0 ? response.data[0] : null;
    } catch (error) {
      throw error;
    }
  }

  async getCountries(): Promise<any> {
    try {
      const response = await axiosInstance.get<any>(`/getCountries`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  // async updateCompanyDetails(userEmail: string): Promise<CompanySetting | null> {
  //   try {
  //     const response = await axiosInstance.put<CompanySetting[]>(`/getCompanyDetails?email=${userEmail}`, );
  //     return response.data.length > 0 ? response.data[0] : null;
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  // async updateCompanyDetails(companySetting: CompanySetting): Promise<void> {
  //   debugger;
  //   try {
  //     await axiosInstance.put(`/getCompanyDetails?id=${companySetting.id}`, companySetting);
  //   } catch (error) {
  //     throw error;
  //   }
  // }


  async updateCompanyDetails(invoice: CompanySetting): Promise<void> {
    debugger;
    try {
      await axiosInstance.put(`getCompanyDetails/${invoice.id}`, invoice);
    } catch (error) {
      throw error;
    }
  }
  // async updateCompanyDetails(companySetting: CompanySetting): Promise<void> {
  //   debugger;
  //   try {
  //     await axiosInstance.put(`getCompanyDetails`, companySetting); // Changed endpoint to updateCompanyDetails
  //   } catch (error) {
  //     console.error("API Error:", error);
  //     throw error;
  //   }
  // }

};

