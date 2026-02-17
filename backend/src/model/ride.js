import mongoose from "mongoose";

const riderSchema = new mongoose.Schema(
  {
    // WHO
    riderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Rider is required"],
    },
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null, // null untill a driver accepts
    },

    // WHERE
    pickup: {
      address: {
        type: String,
        required: [true, "Pickup address is required"],
      },
      coordinates: {
        type: {
          type: String,
          enum: ["Point"],
          default: "Point",
        },
        coordinates: {
          type: [Number],
          required: [true, "Pickup coordinates is required"],
        },
      },
    },
    destination: {
      address: {
        type: String,
        required: [true, "Destination is required"],
      },
      coordinates: {
        type: {
          type: String,
          enum: ["Point"],
          default: "Point",
        },
        coordinates: {
          type: [Number],
          required: [true, "Destination Co-ordinates is required"],
        },
      },
    },

    // WHAT
    vechicleType: {
      type: String,
      enum: ["economy", "premium", "suv"],
      default: "economy",
    },

    // HOW MUCH

    fare: {
      baseFare: {
        type: Number,
        default: 0,
      },
      distance: {
        type: Number,
        default: 0,
      },
      timeFare: {
        type: Number,
        default: 0,
      },
      surgeMultiplier: {
        type: Number,
        default: 1,
      },
      totalFare: {
        type: Number,
        default: 0,
      },
    },
    // How FAR

    distance: {
      // Distance in Kilomete
      type: Number,
      default: 0,
    },
    duration: {
      // Duration in minutes
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["requested", "accepted", "started", "completed", "cancelled"],
      default: "requested",
    },

    // CANCELLATION
    cancelledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    cancellation: {
      type: String,
      default: null,
    },

    // PAYMENT
    paymentMethod: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending",
    },

    rating: {
      riderRating: {
        type: Number,
        min: 1,
        max: 5,
        default: null,
      },
      driverRating: {
        type: Number,
        min: 1,
        max: 5,
        default: null,
      },
      riderComment: {
        type: String,
        default: null,
      },
      driverComment: {
        type: String,
        default: null,
      },
    },
    requestedAt: {
      type: Date,
      default: Date.now(),
    },
    acceptedAt: {
      type: Date,
      default: null,
    },
    startedAt: {
      type: Date,
      default: null,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    cancelledAt: {
      type: Date,
      default: null,
    },

    otp: {
      type: String,
      default: null,
      select: false, // Don't expose OTP
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: {
      virtuals: true,
    },
  },
);
  riderSchema.index({riderId:1}),
  riderSchema.index({driverId:1}),
  riderSchema.index({status:1}),
  riderSchema.index({'pickup.coordinates':'2dsphere'}),
  riderSchema.index({'destination.coordinates':'2dsphere'}),
  riderSchema.index({createdAt:-1}), // Latest ride first

  riderSchema.virtual('waitTime').get(function(){
    if(!this.acceptedAt ) return null
    return Math.round((this.acceptedAt - this.requestedAt)/1000/60); // MINUTES
  }),

  riderSchema.virtual('rideDuration').get(function(){
     if(!this.completedAt || !this.startedAt) return null
     return Math.round((this.completedAt - this.startedAt)/1000/60); // minutes
  }),

  riderSchema.statics.findActiveRideForRider=async function (riderId){
    return this.findOne({
        riderId,
        status:{$in:['requested','accepted','started']},
    })
  },

  riderSchema.statics.findActiveRideForDriver=async function(driverId){
    return this.findOne({
        driverId,
        status:{$in:['accepted','started']},
    })
  },

  riderSchema.methods.calculateFare=function (distance,duration,vechicleType){
    const PRICING={
        economy:{base:40,perkm:12,perMin:1.5},
        premium:{base:80,perkm:20,perMin:2.5},
        suv:{base:100,perkm:25,perMin:3}
    };
    const pricing=PRICING[vechicleType || PRICING.economy]
    const surge=this.fare.surgeMultiplier || 1 ;

    const baseFare=pricing.base;
    const distanceFare=distance.pricing.perkm;
    const timeFare=duration.perMin;
    const totalFare=Math.round((baseFare + distanceFare + timeFare)* surge);

    this.fare={baseFare,distanceFare,timeFare,surgeMultiplier:surge,totalFare}
    return this.fare;
  }

  const Ride=mongoose.model('Ride',riderSchema);

  export default Ride;


