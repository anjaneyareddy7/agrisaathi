// Real API client that connects to your FastAPI backend
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const base44 = {
  entities: {
    Diagnosis: {
      list: async () => {
        try {
          const response = await fetch(`${API_URL}/api/diagnosis/history`);
          if (!response.ok) return [];
          return await response.json();
        } catch {
          return [];
        }
      },
      create: async (data) => {
        try {
          const response = await fetch(`${API_URL}/api/diagnosis/analyze`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
          });
          if (!response.ok) throw new Error('Analysis failed');
          return await response.json();
        } catch (error) {
          console.error('Diagnosis API error:', error);
          throw error;
        }
      },
      filter: async () => []
    },
    Farm: {
      list: async () => {
        try {
          const response = await fetch(`${API_URL}/api/farms`);
          if (!response.ok) return [];
          return await response.json();
        } catch {
          return [];
        }
      },
      create: async (data) => {
        try {
          const response = await fetch(`${API_URL}/api/farms`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
          });
          if (!response.ok) throw new Error('Failed to create farm');
          return await response.json();
        } catch (error) {
          console.error('Farm API error:', error);
          throw error;
        }
      },
      delete: async () => {}
    },
    Crop: {
      list: async () => {
        try {
          const response = await fetch(`${API_URL}/api/crops`);
          if (!response.ok) return [];
          return await response.json();
        } catch {
          return [];
        }
      }
    },
    CropCycle: {
      list: async () => {
        try {
          const response = await fetch(`${API_URL}/api/crop-cycles`);
          if (!response.ok) return [];
          return await response.json();
        } catch {
          return [];
        }
      },
      create: async (data) => {
        try {
          const response = await fetch(`${API_URL}/api/crop-cycles`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
          });
          if (!response.ok) throw new Error('Failed to create crop cycle');
          return await response.json();
        } catch (error) {
          console.error('CropCycle API error:', error);
          throw error;
        }
      },
      filter: async () => []
    },
    LivestockCareLog: {
      list: async () => [],
      create: async (data) => data,
      filter: async () => [],
      update: async () => {}
    },
    FarmLedgerEntry: {
      list: async () => [],
      create: async (data) => data,
      bulkCreate: async (data) => data
    },
    HarvestRecord: {
      list: async () => [],
      create: async (data) => data,
      delete: async () => {}
    },
    SoilRecord: {
      list: async () => [],
      create: async (data) => data
    },
    MarketPrice: {
      list: async () => []
    },
    GovMarket: {
      list: async () => []
    },
    KVK: {
      list: async () => []
    },
    InputShop: {
      list: async () => []
    },
    CropPassport: {
      list: async () => [],
      create: async (data) => data,
      update: async () => {},
      get: async () => ({})
    },
    GovScheme: {
      list: async () => []
    },
    GovLoan: {
      list: async () => []
    },
    VoiceNote: {
      list: async () => [],
      create: async (data) => data,
      delete: async () => {}
    },
    ForumPost: {
      list: async () => [],
      create: async (data) => data,
      update: async () => {},
      get: async () => ({})
    },
    InsurancePolicy: {
      list: async () => [],
      create: async (data) => data,
      update: async () => {},
      delete: async () => {}
    },
    InventoryItem: {
      list: async () => [],
      create: async (data) => data,
      update: async () => {},
      delete: async () => {}
    },
    Equipment: {
      list: async () => [],
      create: async (data) => data,
      delete: async () => {}
    },
    ResourceListing: {
      list: async () => [],
      create: async (data) => data,
      delete: async () => {}
    },
    FarmTask: {
      list: async () => [],
      create: async (data) => data,
      update: async () => {},
      delete: async () => {}
    },
    SupportTicket: {
      list: async () => [],
      create: async (data) => data,
      update: async () => {},
      delete: async () => {}
    },
    Feedback: {
      list: async () => [],
      create: async (data) => data,
      delete: async () => {}
    },
    SuccessStory: {
      list: async () => [],
      create: async (data) => data,
      delete: async () => {}
    },
    FarmNotification: {
      list: async () => [],
      create: async (data) => data,
      update: async () => {},
      delete: async () => {}
    },
    VendorContact: {
      list: async () => [],
      create: async (data) => data,
      delete: async () => {}
    },
    ExpertContact: {
      list: async () => [],
      create: async (data) => data,
      delete: async () => {}
    },
    TrainingResource: {
      list: async () => []
    },
    PestEntry: {
      list: async () => [],
      create: async (data) => data,
      delete: async () => {}
    },
    IrrigationSession: {
      list: async () => [],
      create: async (data) => data,
      update: async () => {},
      delete: async () => {}
    },
    SensorTest: {
      list: async () => [],
      create: async (data) => data,
      delete: async () => {}
    },
    DocumentWallet: {
      list: async () => [],
      create: async (data) => data,
      delete: async () => {}
    },
    FarmAnimalType: {
      list: async () => []
    },
    HelperPhotoQA: {
      create: async (data) => data
    },
    HelperOpenQuery: {
      create: async (data) => data
    },
    StateSoilProfile: {
      list: async () => []
    }
  },
  integrations: {
    Core: {
      UploadFile: async ({ file }) => {
        try {
          const formData = new FormData();
          formData.append('file', file);
          const response = await fetch(`${API_URL}/api/upload`, {
            method: 'POST',
            body: formData
          });
          if (!response.ok) throw new Error('Upload failed');
          const data = await response.json();
          return { file_url: data.url };
        } catch (error) {
          console.error('Upload error:', error);
          throw error;
        }
      },
      InvokeLLM: async ({ prompt, file_urls, response_json_schema }) => {
        // Forward to diagnosis API
        try {
          const response = await fetch(`${API_URL}/api/diagnosis/analyze`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              prompt,
              file_urls,
              schema: response_json_schema
            })
          });
          if (!response.ok) throw new Error('LLM analysis failed');
          return await response.json();
        } catch (error) {
          console.error('LLM API error:', error);
          // Fallback to mock
          return {
            likely_issue: "Unable to connect to analysis service. Please try again.",
            alternatives: ["Check internet connection", "Try uploading a clearer photo"],
            confidence: "low",
            evidence: "Service temporarily unavailable",
            organic_treatment: "Monitor plants regularly",
            chemical_treatment: "Consult local agriculture expert",
            precautions: "Maintain proper watering and nutrition",
            escalate: false,
            escalation_note: ""
          };
        }
      }
    }
  },
  auth: {
    me: async () => {
      try {
        const response = await fetch(`${API_URL}/api/auth/me`, {
          credentials: 'include'
        });
        if (!response.ok) throw new Error('Not authenticated');
        return await response.json();
      } catch {
        return { id: 'guest', full_name: 'Guest User', email: 'guest@example.com' };
      }
    },
    updateMe: async (data) => data,
    loginViaEmailPassword: async () => {},
    loginWithProvider: async () => {},
    logout: () => {},
    redirectToLogin: () => {},
    register: async () => {},
    verifyOtp: async () => {},
    resendOtp: async () => {},
    resetPasswordRequest: async () => {},
    resetPassword: async () => {},
    setToken: () => {}
  }
};
