import mongoose from 'mongoose'

// Define the property address schema separately
// const propertyAddressSchema = new mongoose.Schema({
//   address: {
//     type: String,
//   },
//   postCode: {
//     type: String,
//   },
//   city: {
//     type: String,
//   },
// })

// Define the property Type schema separately
// const propertyTypeSchema = new mongoose.Schema({
//   id: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'PropertyType',
//   },
//   value: {
//     type: String,
//   },
// })

// Define the property Status schema separately
// const propertyStatusSchema = new mongoose.Schema({
//   id: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'PropertyStatus',
//   },
//   value: {
//     type: String,
//   },
// })

// Define the property Category schema separately
// const propertyCategorySchema = new mongoose.Schema({
//   id: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'PropertyCategory',
//   },
//   value: {
//     type: String,
//   },
// })

// Define the property AI schema separately
// const propertyAISchema = new mongoose.Schema({
//   id: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'PropertyAI',
//   },
//   value: {
//     type: String,
//   },
//   aiFiles: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'AIFile',
//   },
// })

// Define the property PointOfContact schema separately
// const propertyPointOfContactSchema = new mongoose.Schema({
//   id: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'PropertyPointOfContact',
//   },
//   name: {
//     type: String,
//   },
// })

// Define the property Keys schema separately
// const propertyKeysSchema = new mongoose.Schema({
//   id: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'PropertyKeys',
//   },
//   value: {
//     type: String,
//   },
//   keyImages: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'keyImage',
//   },
// })

// Define the property SubscriptionFee schema separately
// const propertySubscriptionFeeSchema = new mongoose.Schema({
//   id: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'PropertySubscriptionFee',
//   },
//   value: {
//     type: String,
//   },
// })

// Define the property FlatFeeService schema separately
// const propertyFlatFeeServiceSchema = new mongoose.Schema({
// serviceId: {
//   type: mongoose.Schema.Types.ObjectId,
//   ref: 'PropertyFlatFeeService',
// },
// serviceName: {
//   type: String,
// },
// initialTimeMinutes: {
//   type: String,
// },
// initialTimeFees: {
//   type: String,
// },
// additionalTimeMinutes: {
//   type: String,
// },
// additionalTimeFees: {
//   type: String,
// },
// })

const propertySchema = new mongoose.Schema({
  branchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch',
    required: true,
  },
  branchName: {
    type: String,
    required: true,
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
  },
  companyName: {
    type: String,
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true,
  },
  customerName: {
    type: String,
    required: true,
  },
  propertyCreatedByUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  propertyCreatedByUserName: {
    type: String,
    required: true,
  },
  propertyId: {
    type: String,
  },
  customerRandomId: {
    type: Number,
  },
  branchRandomId: {
    type: Number,
  },
  propertyRandomId: {
    type: Number,
  },
  propertyReference: {
    type: String,
  },
  propertyName: {
    type: String,
    required: true,
  },
  propertyPhotos: [
    {
      type: String,
    },
  ],
  propertyAddress: {
    address: {
      type: String,
    },
    postCode: {
      type: String,
    },
    city: {
      type: String,
    },
  },
  propertyType: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PropertyType',
    },
    value: {
      type: String,
    },
  },
  propertyStatus: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PropertyStatus',
    },
    value: {
      type: String,
    },
  },
  propertyChargeable: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PropertyChargeAble',
    },
    value: {
      type: String,
    },
  },
  propertyCategory: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PropertyCategory',
    },
    value: {
      type: String,
    },
  },
  propertyAI: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PropertyAI',
    },
    value: {
      type: String,
    },
  },
  aiNotes: {
    type: String,
  },
  aiFiles: [
    {
      type: String,
    },
  ],
  propertyStartDate: {
    type: Date,
  },
  propertyFinishDate: {
    type: Date,
  },
  propertyTotalPrice: {
    type: Number,
  },
  // propertyPointOfContact: [propertyPointOfContactSchema], // Reference the Property PointOfContact schema here
  propertyPointOfContact: [
    {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PropertyPointOfContact',
      },
      name: {
        type: String,
        required: true,
      },
      address: {
        type: String,
      },
      city: {
        type: String,
      },
      postCode: {
        type: String,
      },
      contact: {
        type: String,
      },
      email: {
        type: String,
        required: true,
      },
    },
  ], // Reference the Property PointOfContact schema here
  propertyKeys: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PropertyKeys',
    },
    value: {
      type: String,
    },
  },
  propertyKeyValue: {
    type: String,
  },
  keyImages: [
    {
      type: String,
    },
  ],
  propertySubscriptionFee: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PropertySubscriptionFee',
    },
    value: {
      type: String,
    },
  },
  propertySubscriptionFeeValue: {
    type: String,
  },

  propertySubscriptionCharges: {
    type: String,
  },
  propertyInternalNotes: {
    type: String,
  },
  propertyExternalNotes: {
    type: String,
  },
  propertyFlatFeeServiceData: [
    {
      serviceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PropertyFlatFeeService',
      },
      serviceName: {
        type: String,
      },
      initialTimeMinutes: {
        type: String,
      },
      initialTimeFees: {
        type: String,
      },
      additionalTimeMinutes: {
        type: String,
      },
      additionalTimeFees: {
        type: String,
      },
      totalFee: {
        type: Number,
      },
    },
  ],
})

export default mongoose.model('Property', propertySchema)
