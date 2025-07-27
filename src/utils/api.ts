const API_BASE_URL = process.env.NODE_ENV === "production" 
  ? "https://your-app.vercel.app" 
  : "http://localhost:3000"

class ApiClient {
  private getAuthHeaders() {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` })
    }
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}/api${endpoint}`
    
    const config: RequestInit = {
      headers: this.getAuthHeaders(),
      ...options
    }

    const response = await fetch(url, config)
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "Error desconocido" }))
      throw new Error(error.message || `HTTP ${response.status}`)
    }

    return response.json()
  }

  // Auth
  async login(email: string, password: string) {
    return this.request("/auth", {
      method: "POST",
      body: JSON.stringify({ email, password })
    })
  }

  // Members
  async getMembers(params?: any) {
    const searchParams = new URLSearchParams(params)
    return this.request(`/members?${searchParams}`)
  }

  async createMember(data: any) {
    return this.request("/members", {
      method: "POST",
      body: JSON.stringify(data)
    })
  }

  async updateMember(id: string, data: any) {
    return this.request(`/members/${id}`, {
      method: "PUT",
      body: JSON.stringify(data)
    })
  }

  async deleteMember(id: string) {
    return this.request(`/members/${id}`, {
      method: "DELETE"
    })
  }

  async toggleMemberStatus(id: string) {
    return this.request(`/members/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ action: "toggle_status" })
    })
  }

  // Payments
  async getPayments(params?: any) {
    const searchParams = new URLSearchParams(params)
    return this.request(`/payments?${searchParams}`)
  }

  async createPayment(data: any) {
    return this.request("/payments", {
      method: "POST",
      body: JSON.stringify(data)
    })
  }

  async deletePayment(id: string) {
    return this.request(`/payments/${id}`, {
      method: "DELETE"
    })
  }

  // Dashboard
  async getDashboard() {
    return this.request("/dashboard")
  }
}

export const apiClient = new ApiClient()
