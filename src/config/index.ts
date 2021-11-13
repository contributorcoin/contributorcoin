import approved from './approved'
import banned from './banned'

export default {
  transactions: {
    thresholdCount: 5,
    poolTimeCap: 300000
  },
  rewards: {
    contribution: {
      total: 100,
      authorsPercent: .8,
      approversPercent: .2
    },
    validation: {
      total: 10,
    }
  },
  ...approved,
  ...banned,
}
