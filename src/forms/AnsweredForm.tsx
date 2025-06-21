import { Button } from "@/components/ui/button"

type Applicant = {
  name: string
  email: string
  position: string
  phone: string
  address: string
  avatar: string
  status: string
}

type AnsweredFormProps = {
  applicant: Applicant
}

export default function AnsweredForm({ applicant }: AnsweredFormProps) {
  return (
    <div className="mt-6 space-y-8">
      {/* your form JSX continues here... */}

      {/* Personal Information Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <h3 className="font-semibold text-gray-900">Personal Information</h3>
          <div className="flex-1 h-px bg-blue-500"></div>
        </div>

        <div className="space-y-4">
          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <p className="px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-700">
  {applicant.name.split(" ")[0]}
</p>


            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <p className="px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-700">
  {applicant.name.split(" ")[1]}
</p>

            </div>
          </div>

          {/* Birth Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Birth Date</label>
            <input
              type="text"
              placeholder="DD-MM-YYYY"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              defaultValue="15-03-1990"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Gender</label>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  defaultChecked
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Male</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Female</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  value="prefer-not-to-say"
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">I prefer not to say</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Information Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <h3 className="font-semibold text-gray-900">Contact Information</h3>
          <div className="flex-1 h-px bg-blue-500"></div>
        </div>

        <div className="space-y-4">
          {/* Contact Numbers */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Primary Contact Number
              </label>
              <input
                type="tel"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                defaultValue={applicant.phone}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Secondary Contact Number
              </label>
              <input
                type="tel"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                defaultValue={applicant.phone}

              />
            </div>
          </div>

          {/* Email and LinkedIn */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                defaultValue={applicant.email}

              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
              <input
                type="url"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                defaultValue={`https://linkedin.com/in/${applicant.name.replace(/\s+/g, '').toLowerCase()}`}

              />
            </div>
          </div>
        </div>
      </div>

      {/* Address Information Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <h3 className="font-semibold text-gray-900">Address Information</h3>
          <div className="flex-1 h-px bg-blue-500"></div>
        </div>

        <div className="space-y-4">
          {/* City and State */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                defaultValue="San Francisco"
              />
              <label className="block text-xs text-gray-500 mt-1">City/District</label>
            </div>
            <div>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                defaultValue="California"
              />
              <label className="block text-xs text-gray-500 mt-1">State/Province</label>
            </div>
          </div>

          {/* Postal Code and Country */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                defaultValue="94102"
              />
              <label className="block text-xs text-gray-500 mt-1">Postal Code</label>
            </div>
            <div>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                defaultValue="United States"
              />
              <label className="block text-xs text-gray-500 mt-1">Country</label>
            </div>
          </div>
        </div>
      </div>

      {/* Job Details Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <h3 className="font-semibold text-gray-900">Job Details</h3>
          <div className="flex-1 h-px bg-blue-500"></div>
        </div>

        <div className="space-y-4">
          {/* Position and Salary */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-1">Position Applying for</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                defaultValue="Software Engineer"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-1">Expected Salary</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                defaultValue="$120,000 - $150,000"
              />
            </div>
          </div>

          {/* Work Onsite and Photo Upload */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-1">
                Are you willing to work onsite?
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option value="">Select an option</option>
                <option value="yes">Yes, I'm willing to work onsite</option>
                <option value="no">No, I prefer remote work</option>
                <option value="hybrid">I'm open to hybrid arrangements</option>
                <option value="negotiable">It's negotiable</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-1">
                Upload recent 2x2 photo
              </label>
              <div className="flex items-center gap-2">
                <input type="file" accept="image/*" className="hidden" id="photo-upload" />
                <label
                  htmlFor="photo-upload"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-500"
                >
                  Choose file...
                </label>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => document.getElementById("photo-upload")?.click()}
                >
                  Upload
                </Button>
              </div>
            </div>
          </div>

          {/* Medical Certificate Upload */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-1">
              Upload medical certificate for the last 6 months
            </label>
            <div className="flex items-center gap-2">
              <input
                type="file"
                accept=".pdf,.doc,.docx,image/*"
                className="hidden"
                id="medical-upload"
              />
              <label
                htmlFor="medical-upload"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-500"
              >
                Choose file...
              </label>
              <Button
                size="sm"
                variant="outline"
                onClick={() => document.getElementById("medical-upload")?.click()}
              >
                Upload
              </Button>
            </div>
          </div>

          {/* Preferred Interview Schedule */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-1">
              Preferred Interview Schedule (3 dates, eg February 20)
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              placeholder="Please provide 3 preferred dates for your interview..."
              defaultValue={`February 20, 2024
February 22, 2024
February 25, 2024`}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
