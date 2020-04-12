import * as yup from 'yup';
import {
  ConvectorModel,
  Default,
  ReadOnly,
  Required,
  Validate,
  FlatConvectorModel
} from '@worldsibu/convector-core-model';


export class MECNode extends ConvectorModel<MECNode> {
  @ReadOnly() 
  @Required()
  public readonly type = 'io.worldsibu.mecnode';

  // Owner of the car
  @Required() 
  @Validate(yup.string())
  public owner: string;

  // ip of the mec
  @Required() 
  @Validate(yup.string())
  public id: string;

  // ip of the mec
  @Required() 
  @Validate(yup.string())
  public ip: string;

  @Required() 
  @Validate(yup.number())
  public latitute: number;

  @Required() 
  @Validate(yup.number())
  public longtitue: number;
}

export class MECProvider extends ConvectorModel<MECProvider> {
  @ReadOnly() 
  @Required()
  public readonly type = 'io.worldsibu.mecprovider';

  // @Required() 
  @Validate(yup.string())
  public id: string;

  // Owner of the car
  @Required() 
  @Validate(yup.string())
  public name: string;

  @Required() 
  @Validate(yup.string())
  public country: string;

  @Validate(yup.number())
  public amount: number;

  @Validate(yup.array(MECNode.schema()))
  public mecNodes: Array<FlatConvectorModel<MECNode>>;
}

export class Service extends ConvectorModel<Service> {
  @ReadOnly() 
  @Required()
  public readonly type = 'io.worldsibu.service';

  // Owner of the service: service provider
  // @Required() 
  @Validate(yup.string())
  public owner: string;

  // ip of the mec
  @Required() 
  @Validate(yup.string())
  public id: string;
  // name is id

  @Required() 
  @Validate(yup.string())
  public imagelink: string;

  @Required() 
  @Validate(yup.number())
  public expense: number;
}

export class ServiceProvider extends ConvectorModel<MECProvider> {
  @ReadOnly() 
  @Required()
  public readonly type = 'io.worldsibu.serviceprovider';

  @Required() 
  @Validate(yup.string())
  public id: string;

  // Owner of the car
  @Required() 
  @Validate(yup.string())
  public name: string;

  @Required() 
  @Validate(yup.string())
  public country: string;

  @Validate(yup.number())
  public amount: number;

  @Validate(yup.array(Service.schema()))
  public services: Array<FlatConvectorModel<Service>>;
}

export enum LogType {
  PAYMENT,
  START_SERVICE,
  STOP_SERVICE,
  TIMEOUT
}

export class UserLog extends ConvectorModel<UserLog> {
  @ReadOnly() 
  @Required()
  public readonly type = 'io.worldsibu.userlog';

  @Required() 
  @Validate(yup.string())
  public id: string;

  // Owner of the car
  @Required() 
  @Validate(yup.string())
  public logType: LogType;

  @Required()
  @Validate(yup.string())
  public owner: string;

  @Validate(yup.number())
  public amount: number;

  @Validate(yup.string())
  public service: string;

  @Validate(yup.string())
  public mec: string;
}

export class User extends ConvectorModel<User> {
  @ReadOnly() 
  @Required()
  public readonly type = 'io.worldsibu.user';

  // @Required() 
  // @Validate(yup.string())
  // public id: string;

  // Owner of the car
  @Required() 
  @Validate(yup.string())
  public name: string;

  @Validate(yup.number())
  public amount: number;

  @Validate(yup.array(UserLog.schema()))
  public logs: Array<FlatConvectorModel<UserLog>>;
}