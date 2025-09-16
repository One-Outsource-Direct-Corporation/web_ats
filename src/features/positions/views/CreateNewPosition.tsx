import { Button } from "../../../components/ui/button";
import { useCreateNewPosition } from "../hooks/useCreateNewPosition";
import DetailsStep from "../components/DetailsStep";
import DescriptionStep from "../components/DescriptionStep";

export default function CreateNewPosition() {
  const {
    // Step management
    currentStep,
    steps,
    completedSteps,

    // Modal states
    showModal,
    setShowModal,
    showPreview,
    setShowPreview,
    showSuccessPage,
    showNonNegotiableModal,
    setShowNonNegotiableModal,

    // Navigation handlers
    handleCancel,
    handleConfirmCancel,
    handleNext,
    handleBack,
    handleStepClick,
    getStepTitle,
    handleSaveNonNegotiables,

    // All feature hooks
    formData,
    locationsBatches,
    jobDescription,
  } = useCreateNewPosition();

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <DetailsStep
            formData={formData.formData}
            onInputChange={formData.handleInputChange}
            locations={locationsBatches.locations}
            batches={locationsBatches.batches}
            editingLocationId={locationsBatches.editingLocationId}
            editingBatchId={locationsBatches.editingBatchId}
            onEditLocation={locationsBatches.handleEditLocation}
            onLocationChange={locationsBatches.handleLocationChange}
            onEditBatch={locationsBatches.handleEditBatch}
            onBatchChange={locationsBatches.handleBatchChange}
            onAddLocation={locationsBatches.addLocation}
            onDeleteLocation={locationsBatches.deleteLocation}
            onAddBatch={locationsBatches.addBatch}
            onDeleteBatch={locationsBatches.deleteBatch}
            setEditingLocationId={locationsBatches.setEditingLocationId}
            setEditingBatchId={locationsBatches.setEditingBatchId}
          />
        );

      case 2:
        return (
          <DescriptionStep
            jobDescription={jobDescription.jobDescription}
            setJobDescription={jobDescription.setJobDescription}
            jobDescriptionRef={jobDescription.jobDescriptionRef}
            showAlignmentOptions={jobDescription.showAlignmentOptions}
            setShowAlignmentOptions={jobDescription.setShowAlignmentOptions}
            onFormat={jobDescription.handleFormat}
            onAlignment={jobDescription.handleAlignment}
            onList={jobDescription.handleList}
            onLink={jobDescription.handleLink}
          />
        );

      case 3:
        return (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            {/* Candidate Applications */}
            <div className="mb-8">
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                Candidate Applications
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Choose how candidates can apply to this position.
              </p>

              <div className="space-y-3">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="candidateApplication"
                    value="external"
                    defaultChecked
                    className="w-4 h-4 bg-white border-2 border-gray-400 rounded-full appearance-none focus:ring-2 focus:ring-blue-500 checked:bg-white checked:border-blue-600 checked:after:content-[''] checked:after:w-2 checked:after:h-2 checked:after:bg-blue-600 checked:after:rounded-full checked:after:absolute checked:after:top-1/2 checked:after:left-1/2 checked:after:transform checked:after:-translate-x-1/2 checked:after:-translate-y-1/2 relative"
                  />
                  <span className="text-sm text-blue-600">
                    External Job Posting Platforms (LinkedIn, Jobstreet, etc.)
                  </span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="candidateApplication"
                    value="internal"
                    className="w-4 h-4 bg-white border-2 border-gray-400 rounded-full appearance-none focus:ring-2 focus:ring-blue-500 checked:bg-white checked:border-blue-600 checked:after:content-[''] checked:after:w-2 checked:after:h-2 checked:after:bg-blue-600 checked:after:rounded-full checked:after:absolute checked:after:top-1/2 checked:after:left-1/2 checked:after:transform checked:after:-translate-x-1/2 checked:after:-translate-y-1/2 relative"
                  />
                  <span className="text-sm text-gray-700">Internal Only</span>
                </label>
              </div>
            </div>

            {/* Application Form */}
            <div className="mb-8">
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                Application Form
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Choose what information to collect from candidates who apply
                through your Careers Site.
              </p>

              {/* Personal Information */}
              <div className="mb-8">
                <h4 className="text-base font-medium text-gray-800 mb-4">
                  Personal Information
                </h4>
                <div className="border rounded-lg overflow-x-auto w-full">
                  <table className="min-w-full bg-white text-sm table-fixed">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="text-left p-4 font-medium text-gray-700 w-2/5">
                          Field
                        </th>
                        <th className="text-center p-4 font-medium text-gray-700 w-1/8"></th>
                        <th className="text-center p-4 font-medium text-gray-700 w-1/8">
                          Required
                        </th>
                        <th className="text-center p-4 font-medium text-gray-700 w-1/8">
                          Optional
                        </th>
                        <th className="text-center p-4 font-medium text-gray-700 w-1/8">
                          Disabled
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.formFieldStatuses?.personal?.map(
                        (item, index) => (
                          <tr key={index} className="border-b">
                            <td className="p-4 font-medium text-gray-800 w-2/5">
                              {item.field}
                            </td>
                            <td className="p-4 text-center w-1/6"></td>
                            <td className="p-4 text-center w-1/6">
                              <input
                                type="radio"
                                name={`personal_${index}_status`}
                                value="required"
                                checked={item.status === "required"}
                                onChange={(e) =>
                                  formData.handleFormFieldStatusChange(
                                    "personal",
                                    index,
                                    e.target.value as
                                      | "required"
                                      | "optional"
                                      | "disabled"
                                  )
                                }
                                className="w-4 h-4 bg-white border-2 border-gray-400 rounded-full appearance-none focus:ring-2 focus:ring-blue-500 checked:bg-white checked:border-blue-600 checked:after:content-[''] checked:after:w-2 checked:after:h-2 checked:after:bg-blue-600 checked:after:rounded-full checked:after:absolute checked:after:top-1/2 checked:after:left-1/2 checked:after:transform checked:after:-translate-x-1/2 checked:after:-translate-y-1/2 relative"
                              />
                            </td>
                            <td className="p-4 text-center w-1/6">
                              <input
                                type="radio"
                                name={`personal_${index}_status`}
                                value="optional"
                                checked={item.status === "optional"}
                                onChange={(e) =>
                                  formData.handleFormFieldStatusChange(
                                    "personal",
                                    index,
                                    e.target.value as
                                      | "required"
                                      | "optional"
                                      | "disabled"
                                  )
                                }
                                className="w-4 h-4 bg-white border-2 border-gray-400 rounded-full appearance-none focus:ring-2 focus:ring-blue-500 checked:bg-white checked:border-blue-600 checked:after:content-[''] checked:after:w-2 checked:after:h-2 checked:after:bg-blue-600 checked:after:rounded-full checked:after:absolute checked:after:top-1/2 checked:after:left-1/2 checked:after:transform checked:after:-translate-x-1/2 checked:after:-translate-y-1/2 relative"
                              />
                            </td>
                            <td className="p-4 text-center w-1/6">
                              <input
                                type="radio"
                                name={`personal_${index}_status`}
                                value="disabled"
                                checked={item.status === "disabled"}
                                onChange={(e) =>
                                  formData.handleFormFieldStatusChange(
                                    "personal",
                                    index,
                                    e.target.value as
                                      | "required"
                                      | "optional"
                                      | "disabled"
                                  )
                                }
                                className="w-4 h-4 bg-white border-2 border-gray-400 rounded-full appearance-none focus:ring-2 focus:ring-blue-500 checked:bg-white checked:border-blue-600 checked:after:content-[''] checked:after:w-2 checked:after:h-2 checked:after:bg-blue-600 checked:after:rounded-full checked:after:absolute checked:after:top-1/2 checked:after:left-1/2 checked:after:transform checked:after:-translate-x-1/2 checked:after:-translate-y-1/2 relative"
                              />
                            </td>
                          </tr>
                        )
                      ) || []}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Job Details */}
              <div className="mb-8">
                <h4 className="text-base font-medium text-gray-800 mb-4">
                  Job Details
                </h4>
                <div className="border rounded-lg overflow-x-auto w-full">
                  <table className="min-w-full bg-white text-sm table-fixed">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="text-left p-4 font-medium text-gray-700 w-2/5">
                          Field
                        </th>
                        <th className="text-center p-4 font-medium text-gray-700 w-1/8">
                          Non-Negotiable
                        </th>
                        <th className="text-center p-4 font-medium text-gray-700 w-1/8">
                          Required
                        </th>
                        <th className="text-center p-4 font-medium text-gray-700 w-1/8">
                          Optional
                        </th>
                        <th className="text-center p-4 font-medium text-gray-700 w-1/8">
                          Disabled
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.formFieldStatuses?.job?.map((item, index) => (
                        <tr key={index} className="border-b">
                          <td className="p-4 font-medium text-gray-800 w-2/5">
                            {item.field}
                          </td>
                          <td className="p-4 text-center w-1/6">
                            <input
                              type="checkbox"
                              name={`job_${index}_non_negotiable`}
                              value="non-negotiable"
                              checked={item.nonNegotiable}
                              onChange={(e) =>
                                formData.handleFormFieldNonNegotiableChange(
                                  "job",
                                  index,
                                  e.target.checked
                                )
                              }
                              className="w-4 h-4 bg-white border-2 border-gray-400 rounded focus:ring-2 focus:ring-blue-500 checked:bg-white checked:border-blue-600 appearance-none relative checked:after:content-['✓'] checked:after:absolute checked:after:inset-0 checked:after:flex checked:after:items-center checked:after:justify-center checked:after:text-blue-600 checked:after:text-xs checked:after:font-bold"
                            />
                          </td>
                          <td className="p-4 text-center w-1/6">
                            <input
                              type="radio"
                              name={`job_${index}_status`}
                              value="required"
                              checked={item.status === "required"}
                              onChange={(e) =>
                                formData.handleFormFieldStatusChange(
                                  "job",
                                  index,
                                  e.target.value as
                                    | "required"
                                    | "optional"
                                    | "disabled"
                                )
                              }
                              className="w-4 h-4 bg-white border-2 border-gray-400 rounded-full appearance-none focus:ring-2 focus:ring-blue-500 checked:bg-white checked:border-blue-600 checked:after:content-[''] checked:after:w-2 checked:after:h-2 checked:after:bg-blue-600 checked:after:rounded-full checked:after:absolute checked:after:top-1/2 checked:after:left-1/2 checked:after:transform checked:after:-translate-x-1/2 checked:after:-translate-y-1/2 relative"
                            />
                          </td>
                          <td className="p-4 text-center w-1/6">
                            <input
                              type="radio"
                              name={`job_${index}_status`}
                              value="optional"
                              checked={item.status === "optional"}
                              onChange={(e) =>
                                formData.handleFormFieldStatusChange(
                                  "job",
                                  index,
                                  e.target.value as
                                    | "required"
                                    | "optional"
                                    | "disabled"
                                )
                              }
                              className="w-4 h-4 bg-white border-2 border-gray-400 rounded-full appearance-none focus:ring-2 focus:ring-blue-500 checked:bg-white checked:border-blue-600 checked:after:content-[''] checked:after:w-2 checked:after:h-2 checked:after:bg-blue-600 checked:after:rounded-full checked:after:absolute checked:after:top-1/2 checked:after:left-1/2 checked:after:transform checked:after:-translate-x-1/2 checked:after:-translate-y-1/2 relative"
                            />
                          </td>
                          <td className="p-4 text-center w-1/6">
                            <input
                              type="radio"
                              name={`job_${index}_status`}
                              value="disabled"
                              checked={item.status === "disabled"}
                              onChange={(e) =>
                                formData.handleFormFieldStatusChange(
                                  "job",
                                  index,
                                  e.target.value as
                                    | "required"
                                    | "optional"
                                    | "disabled"
                                )
                              }
                              className="w-4 h-4 bg-white border-2 border-gray-400 rounded-full appearance-none focus:ring-2 focus:ring-blue-500 checked:bg-white checked:border-blue-600 checked:after:content-[''] checked:after:w-2 checked:after:h-2 checked:after:bg-blue-600 checked:after:rounded-full checked:after:absolute checked:after:top-1/2 checked:after:left-1/2 checked:after:transform checked:after:-translate-x-1/2 checked:after:-translate-y-1/2 relative"
                            />
                          </td>
                        </tr>
                      )) || []}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Work and Education */}
              <div className="mb-8">
                <h4 className="text-base font-medium text-gray-800 mb-4">
                  Work and Education
                </h4>
                <div className="border rounded-lg overflow-x-auto w-full">
                  <table className="min-w-full bg-white text-sm table-fixed">
                    <thead className="bg-gray-50 border-b w-full">
                      <tr>
                        <th className="text-left p-4 font-medium text-gray-700 w-2/5">
                          Field
                        </th>
                        <th className="text-center p-4 font-medium text-gray-700 w-1/8">
                          Non-Negotiable
                        </th>
                        <th className="text-center p-4 font-medium text-gray-700 w-1/8">
                          Required
                        </th>
                        <th className="text-center p-4 font-medium text-gray-700 w-1/8">
                          Optional
                        </th>
                        <th className="text-center p-4 font-medium text-gray-700 w-1/8">
                          Disabled
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.formFieldStatuses?.education?.map(
                        (item, index) => (
                          <tr key={index} className="border-b">
                            <td className="p-4 font-medium text-gray-800 w-2/5">
                              {item.field}
                            </td>
                            <td className="p-4 text-center w-1/6">
                              <input
                                type="checkbox"
                                name={`education_${index}_non_negotiable`}
                                value="non-negotiable"
                                checked={item.nonNegotiable}
                                onChange={(e) =>
                                  formData.handleFormFieldNonNegotiableChange(
                                    "education",
                                    index,
                                    e.target.checked
                                  )
                                }
                                className="w-4 h-4 bg-white border-2 border-gray-400 rounded focus:ring-2 focus:ring-blue-500 checked:bg-white checked:border-blue-600 appearance-none relative checked:after:content-['✓'] checked:after:absolute checked:after:inset-0 checked:after:flex checked:after:items-center checked:after:justify-center checked:after:text-blue-600 checked:after:text-xs checked:after:font-bold"
                              />
                            </td>
                            <td className="p-4 text-center w-1/6">
                              <input
                                type="radio"
                                name={`education_${index}_status`}
                                value="required"
                                checked={item.status === "required"}
                                onChange={(e) =>
                                  formData.handleFormFieldStatusChange(
                                    "education",
                                    index,
                                    e.target.value as
                                      | "required"
                                      | "optional"
                                      | "disabled"
                                  )
                                }
                                className="w-4 h-4 bg-white border-2 border-gray-400 rounded-full appearance-none focus:ring-2 focus:ring-blue-500 checked:bg-white checked:border-blue-600 checked:after:content-[''] checked:after:w-2 checked:after:h-2 checked:after:bg-blue-600 checked:after:rounded-full checked:after:absolute checked:after:top-1/2 checked:after:left-1/2 checked:after:transform checked:after:-translate-x-1/2 checked:after:-translate-y-1/2 relative"
                              />
                            </td>
                            <td className="p-4 text-center w-1/6">
                              <input
                                type="radio"
                                name={`education_${index}_status`}
                                value="optional"
                                checked={item.status === "optional"}
                                onChange={(e) =>
                                  formData.handleFormFieldStatusChange(
                                    "education",
                                    index,
                                    e.target.value as
                                      | "required"
                                      | "optional"
                                      | "disabled"
                                  )
                                }
                                className="w-4 h-4 bg-white border-2 border-gray-400 rounded-full appearance-none focus:ring-2 focus:ring-blue-500 checked:bg-white checked:border-blue-600 checked:after:content-[''] checked:after:w-2 checked:after:h-2 checked:after:bg-blue-600 checked:after:rounded-full checked:after:absolute checked:after:top-1/2 checked:after:left-1/2 checked:after:transform checked:after:-translate-x-1/2 checked:after:-translate-y-1/2 relative"
                              />
                            </td>
                            <td className="p-4 text-center w-1/6">
                              <input
                                type="radio"
                                name={`education_${index}_status`}
                                value="disabled"
                                checked={item.status === "disabled"}
                                onChange={(e) =>
                                  formData.handleFormFieldStatusChange(
                                    "education",
                                    index,
                                    e.target.value as
                                      | "required"
                                      | "optional"
                                      | "disabled"
                                  )
                                }
                                className="w-4 h-4 bg-white border-2 border-gray-400 rounded-full appearance-none focus:ring-2 focus:ring-blue-500 checked:bg-white checked:border-blue-600 checked:after:content-[''] checked:after:w-2 checked:after:h-2 checked:after:bg-blue-600 checked:after:rounded-full checked:after:absolute checked:after:top-1/2 checked:after:left-1/2 checked:after:transform checked:after:-translate-x-1/2 checked:after:-translate-y-1/2 relative"
                              />
                            </td>
                          </tr>
                        )
                      ) || []}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Acknowledgement */}
              <div className="mb-8">
                <h4 className="text-base font-medium text-gray-800 mb-4">
                  Acknowledgement
                </h4>
                <div className="border rounded-lg overflow-x-auto w-full">
                  <table className="min-w-full bg-white text-sm table-fixed">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="text-left p-4 font-medium text-gray-700 w-2/5">
                          Field
                        </th>
                        <th className="text-center p-4 font-medium text-gray-700 w-1/8"></th>
                        <th className="text-center p-4 font-medium text-gray-700 w-1/8">
                          Required
                        </th>
                        <th className="text-center p-4 font-medium text-gray-700 w-1/8">
                          Optional
                        </th>
                        <th className="text-center p-4 font-medium text-gray-700 w-1/8">
                          Disabled
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.formFieldStatuses?.acknowledgement?.map(
                        (item, index) => (
                          <tr key={index} className="border-b">
                            <td className="p-4 font-medium text-gray-800 w-2/5">
                              {item.field}
                            </td>
                            <td className="p-4 text-center w-1/6"></td>
                            <td className="p-4 text-center w-1/6">
                              <input
                                type="radio"
                                name={`acknowledgement_${index}_status`}
                                value="required"
                                checked={item.status === "required"}
                                onChange={(e) =>
                                  formData.handleFormFieldStatusChange(
                                    "acknowledgement",
                                    index,
                                    e.target.value as
                                      | "required"
                                      | "optional"
                                      | "disabled"
                                  )
                                }
                                className="w-4 h-4 bg-white border-2 border-gray-400 rounded-full appearance-none focus:ring-2 focus:ring-blue-500 checked:bg-white checked:border-blue-600 checked:after:content-[''] checked:after:w-2 checked:after:h-2 checked:after:bg-blue-600 checked:after:rounded-full checked:after:absolute checked:after:top-1/2 checked:after:left-1/2 checked:after:transform checked:after:-translate-x-1/2 checked:after:-translate-y-1/2 relative"
                              />
                            </td>
                            <td className="p-4 text-center w-1/6">
                              <input
                                type="radio"
                                name={`acknowledgement_${index}_status`}
                                value="optional"
                                checked={item.status === "optional"}
                                onChange={(e) =>
                                  formData.handleFormFieldStatusChange(
                                    "acknowledgement",
                                    index,
                                    e.target.value as
                                      | "required"
                                      | "optional"
                                      | "disabled"
                                  )
                                }
                                className="w-4 h-4 bg-white border-2 border-gray-400 rounded-full appearance-none focus:ring-2 focus:ring-blue-500 checked:bg-white checked:border-blue-600 checked:after:content-[''] checked:after:w-2 checked:after:h-2 checked:after:bg-blue-600 checked:after:rounded-full checked:after:absolute checked:after:top-1/2 checked:after:left-1/2 checked:after:transform checked:after:-translate-x-1/2 checked:after:-translate-y-1/2 relative"
                              />
                            </td>
                            <td className="p-4 text-center w-1/6">
                              <input
                                type="radio"
                                name={`acknowledgement_${index}_status`}
                                value="disabled"
                                checked={item.status === "disabled"}
                                onChange={(e) =>
                                  formData.handleFormFieldStatusChange(
                                    "acknowledgement",
                                    index,
                                    e.target.value as
                                      | "required"
                                      | "optional"
                                      | "disabled"
                                  )
                                }
                                className="w-4 h-4 bg-white border-2 border-gray-400 rounded-full appearance-none focus:ring-2 focus:ring-blue-500 checked:bg-white checked:border-blue-600 checked:after:content-[''] checked:after:w-2 checked:after:h-2 checked:after:bg-blue-600 checked:after:rounded-full checked:after:absolute checked:after:top-1/2 checked:after:left-1/2 checked:after:transform checked:after:-translate-x-1/2 checked:after:-translate-y-1/2 relative"
                              />
                            </td>
                          </tr>
                        )
                      ) || []}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Available Questionnaires */}
              <div className="mb-6">
                <h4 className="text-base font-medium text-gray-800 mb-4">
                  Available Questionnaires
                </h4>
                <p className="text-sm text-gray-600 mb-4">
                  Questionnaires let you extend your Application Form with
                  custom questions.
                </p>
                <div className="flex flex-col gap-3 items-start">
                  <div className="flex items-center gap-2">
                    <select
                      className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white w-[400px]"
                      defaultValue=""
                    >
                      <option value="">Select Templates</option>
                      <option value="technical-interview">
                        Technical Interview Questions
                      </option>
                      <option value="behavioral">Behavioral Assessment</option>
                      <option value="cultural-fit">
                        Cultural Fit Questions
                      </option>
                    </select>
                  </div>

                  <div className="flex items-center space-x-2 mt-2">
                    <input
                      type="checkbox"
                      id="include-candidate-experience"
                      defaultChecked
                      className="w-4 h-4 bg-white border-2 border-gray-400 rounded focus:ring-2 focus:ring-blue-500 checked:bg-white checked:border-blue-600 appearance-none relative checked:after:content-['✓'] checked:after:absolute checked:after:inset-0 checked:after:flex checked:after:items-center checked:after:justify-center checked:after:text-blue-600 checked:after:text-xs checked:after:font-bold"
                    />
                    <label
                      htmlFor="include-candidate-experience"
                      className="text-sm text-gray-700"
                    >
                      Include in Candidate Experience (Default)
                    </label>
                  </div>

                  <Button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 w-[180px] mt-3">
                    Add Questionnaire
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            {/* Pipeline Stages */}
            <div className="mb-8">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">
                    Pipeline Stages
                  </h3>
                  <p className="text-sm text-gray-600">
                    You can customize automated stage actions for this pipeline
                    here.
                  </p>
                </div>
                <Button variant="ghost" size="sm">
                  ✕
                </Button>
              </div>

              {/* Pipeline Stages Placeholder */}
              <div className="space-y-6">
                <div className="border-l-4 border-blue-500 pl-6">
                  <h4 className="text-blue-600 font-medium text-sm mb-4">
                    Application Review
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg bg-white">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center">
                            📄
                          </div>
                          <div>
                            <div className="font-medium text-sm text-gray-800">
                              Review Application
                            </div>
                            <div className="text-xs text-gray-500">
                              Manual Review
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-center py-8">
                      <p className="text-gray-500 text-sm">
                        Pipeline configuration would be implemented here
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Assessment Configuration */}
              <div className="lg:col-span-2 space-y-6">
                {/* Select Assessment Section */}
                <div>
                  <h4 className="text-base font-medium text-gray-800 mb-4">
                    Select an assessment to configure questions:
                  </h4>
                  <div className="space-y-3">
                    <div className="border rounded-lg p-4 cursor-pointer transition-colors border-gray-300 bg-white hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-5 h-5 text-gray-600">📄</div>
                          <div>
                            <h5 className="font-medium text-gray-800">
                              Technical Assessment
                            </h5>
                            <p className="text-sm text-gray-600">
                              Online Test • Initial Interview • Required
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            ✏️
                          </Button>
                          <Button variant="ghost" size="sm">
                            🗑️
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="text-center py-8">
                      <p className="text-gray-500 text-sm">
                        Assessment configuration would be implemented here
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Assessment Preview */}
              <div className="lg:col-span-1">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-800 mb-2">
                    Assessment Preview
                  </h4>
                  <p className="text-xs text-gray-600">
                    Preview of selected assessment would appear here
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="bg-white rounded-lg p-6">
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold mb-2">
                Create New Position
              </h3>
              <p className="text-gray-600">Select a step to get started.</p>
            </div>
          </div>
        );
    }
  };

  // Render success page if needed
  if (showSuccessPage) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 pt-[100px]">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-green-600 mb-4">
              Position Created Successfully!
            </h2>
            <p className="text-gray-600">
              Your new position has been created and published.
            </p>
            <Button
              onClick={() => (window.location.href = "/positions")}
              className="mt-4"
            >
              View All Positions
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 p-6 pt-[100px]">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Steps Navigation */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between border-b pb-4">
            {/* Progress steps */}
            <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start sm:gap-8">
              {steps.map((step) => (
                <div
                  key={step.number}
                  onClick={() => handleStepClick(step.number)}
                  className={`flex items-center gap-2 ${
                    step.number <= currentStep ||
                    completedSteps.includes(step.number)
                      ? "cursor-pointer"
                      : ""
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                      step.active
                        ? "bg-blue-600 text-white"
                        : completedSteps.includes(step.number)
                        ? "bg-green-600 text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {completedSteps.includes(step.number) ? "✓" : step.number}
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      step.active
                        ? "text-blue-600"
                        : completedSteps.includes(step.number)
                        ? "text-green-600"
                        : "text-gray-500"
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
              ))}
            </div>

            {/* Cancel Button */}
            <div className="mt-4 sm:mt-0">
              <Button
                onClick={handleCancel}
                variant="ghost"
                className="
                  px-4 py-2 
                  bg-white 
                  text-red-600 
                  border border-red-600 
                  rounded 
                  hover:bg-red-600 
                  hover:text-white
                  transition-colors duration-200
                "
              >
                Cancel
              </Button>
            </div>
          </div>

          {/* MODAL CODE HERE */}
          {showModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
              <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
                {/* Modal Title */}
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Cancel Position Creation
                </h2>

                {/* Modal Body */}
                <p className="text-center text-gray-700 mb-6">
                  Do you want to cancel the position creation?
                </p>

                {/* Modal Actions */}
                <div className="flex justify-end gap-2">
                  <Button
                    onClick={() => setShowModal(false)}
                    variant="ghost"
                    className="
                      px-4 py-2 
                      text-gray-600 
                      hover:text-gray-800
                      transition-colors duration-200
                    "
                  >
                    No
                  </Button>
                  <Button
                    onClick={handleConfirmCancel}
                    className="
                      px-4 py-2 
                      bg-red-600 
                      text-white 
                      rounded 
                      hover:bg-red-700 
                      transition-colors duration-200
                    "
                  >
                    Yes
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="flex justify-between items-start">
            <h2 className="text-3xl font-bold text-gray-800">
              {getStepTitle()}
            </h2>
            <Button
              variant="outline"
              className="text-blue-600 border-blue-600 bg-transparent"
              onClick={() => setShowPreview(true)}
              disabled={
                currentStep !== 1 && currentStep !== 2 && currentStep !== 3
              }
            >
              Preview
            </Button>
          </div>

          {/* Step Content */}
          {renderStepContent()}

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              className="text-gray-600 bg-transparent"
              onClick={handleBack}
              disabled={currentStep === 1}
            >
              ← Back
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleNext}
            >
              {currentStep === 5 ? "Next step →" : "Next step →"}
            </Button>
          </div>
        </div>
      </div>

      {/* Preview Modal Placeholder */}
      {showPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowPreview(false)}
          />
          <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-blue-600">
                  Form Preview
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPreview(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </Button>
              </div>
              <div className="py-4">
                <p className="text-gray-600">
                  Form preview would be rendered here.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Non-Negotiable Requirements Modal */}
      {showNonNegotiableModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowNonNegotiableModal(false)}
          />
          <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h5 className="text-xl font-bold text-gray-800 text-center flex-grow">
                  Non-Negotiable Requirements
                </h5>
                <Button
                  onClick={() => setShowNonNegotiableModal(false)}
                  variant="ghost"
                  size="sm"
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </Button>
              </div>

              <p className="text-sm text-gray-600 mb-6">
                Set the required values for non-negotiable fields. Candidates
                who don't meet these criteria will be automatically filtered
                out.
              </p>

              <div className="space-y-6">
                {/* Sample non-negotiable fields - these would come from the form data */}
                <div className="border rounded-lg p-4">
                  <div className="mb-2">
                    <span className="text-xs text-blue-600 font-medium">
                      Job Details
                    </span>
                    <h4 className="text-sm font-medium text-gray-800">
                      Years of Experience
                    </h4>
                  </div>
                  <input
                    type="number"
                    placeholder="Enter minimum years required"
                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                    min="0"
                  />
                </div>

                <div className="border rounded-lg p-4">
                  <div className="mb-2">
                    <span className="text-xs text-blue-600 font-medium">
                      Work and Education
                    </span>
                    <h4 className="text-sm font-medium text-gray-800">
                      Education Level
                    </h4>
                  </div>
                  <select className="w-full p-2 border border-gray-300 rounded-md text-sm">
                    <option value="">Select minimum education level</option>
                    <option value="High School">High School</option>
                    <option value="Bachelor's Degree">Bachelor's Degree</option>
                    <option value="Master's Degree">Master's Degree</option>
                    <option value="PhD">PhD</option>
                  </select>
                </div>
              </div>

              <div
                className="bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 p-4 mt-6 flex items-start gap-3 rounded-md"
                role="alert"
              >
                <div className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5">
                  ⚠️
                </div>
                <div>
                  <p className="font-bold text-sm">Note:</p>
                  <p className="text-sm">
                    The non-negotiable requirements will be automatically
                    evaluated by our AI system during the screening process.
                    Please ensure that all mandatory fields and qualifications
                    are accurately filled in and meet the listed criteria.
                    Failure to satisfy any of the non-negotiable conditions may
                    result in automatic disqualification from proceeding to the
                    next stage.
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <Button
                  onClick={() => setShowNonNegotiableModal(false)}
                  variant="outline"
                  className="px-4 py-2 border-gray-300"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveNonNegotiables}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Save and Continue
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
