import * as yup from 'yup';
import { ChaincodeTx } from '@worldsibu/convector-platform-fabric';
import {
  Controller,
  ConvectorController,
  Invokable,
  Param
} from '@worldsibu/convector-core';

import { MECNode, MECProvider, Service, ServiceProvider, UserLog, User, LogType} from './mecservice.model';

@Controller('mecservice')
export class MecServiceController extends ConvectorController<ChaincodeTx> {

  @Invokable()
  public async registerServiceProvider(
    @Param(yup.string())
    name: string,
    @Param(yup.string())
    country: string,
  ) {
    // Retrieve to see if exists
    const existing = await ServiceProvider.getOne(this.sender);

    if (!existing || !existing.id) {
      let serviceProvider = new ServiceProvider();
      serviceProvider.id = this.sender;
      serviceProvider.name = name || "";
      serviceProvider.country = country || "";

      console.log(JSON.stringify(serviceProvider));
      await serviceProvider.save();
    } else {
      throw new Error('Identity exists already, please call changeIdentity fn for updates');
    }
  }

  @Invokable()
  public async registerMECProvider(
    @Param(yup.string())
    name: string,
    @Param(yup.string())
    country: string,
  ) {
    // Retrieve to see if exists
    const existing = await MECProvider.getOne(this.sender);

    if (!existing || !existing.id) {
      let mecProvider = new MECProvider();
      mecProvider.id = this.sender;
      mecProvider.name = name || "";
      mecProvider.country = country || "";

      console.log(JSON.stringify(mecProvider));
      await mecProvider.save();
    } else {
      throw new Error('Identity exists already, please call changeIdentity fn for updates');
    }
  }

  @Invokable()
  public async addService(
    @Param(yup.string())
    id: string,
    @Param(yup.string())
    imagelink: string,
    @Param(yup.number())
    expense: number,
  ) {
    // Retrieve to see if exists
    const serviceProvider = await ServiceProvider.getOne(this.sender);
    const existing = await Service.getOne(id);
    if (serviceProvider && !existing) {
      let service = new Service();
      service.id = id;
      service.imagelink = imagelink || "";
      service.expense = expense || 0;
      service.owner = this.sender;
      serviceProvider.services.push(service);
      await service.save();
      await serviceProvider.save();
    } else {
      throw new Error('Identity exists already, please call changeIdentity fn for updates');
    }
  }

  @Invokable()
  public async addMECNode(
    @Param(yup.string())
    id: string,
    @Param(yup.number())
    latitute: number,
    @Param(yup.number())
    longtitue: number,
  ) {
    // Retrieve to see if exists
    const mecProvider = await MECProvider.getOne(this.sender);
    const existing = await MECNode.getOne(id);
    if (mecProvider && !existing) {
      let mecNode = new MECNode();
      mecNode.id = id;
      mecNode.latitute = latitute || 0;
      mecNode.longtitue = longtitue || 0;      

      mecProvider.mecNodes.push(mecNode);
      await mecNode.save();
      await mecProvider.save();
    } else {
      throw new Error('Identity exists already, please call changeIdentity fn for updates');
    }
  }


  @Invokable()
  public async registerUser(
    @Param(yup.string())
    name: string
  ) {
    // Retrieve to see if exists
    const existing = await User.getOne(this.sender);

    if (!existing || !existing.id) {
      let user = new User();
      user.id = this.sender;
      user.name = name || "";

      await user.save();
    } else {
      throw new Error('Identity exists already, please call changeIdentity fn for updates');
    }
  }

  @Invokable()
  public async userCharge(
    @Param(yup.number())
    amount: number
  ) {
    // Retrieve to see if exists
    const user = await User.getOne(this.sender);

    if (user) {
      user.amount = user.amount + amount;
      let userLog = new UserLog();
      userLog.id = this.tx.identity.getMSPID();
      userLog.owner = this.sender;
      userLog.logType = LogType.PAYMENT;
      user.logs.push(userLog);
      await userLog.save();
      await user.save();
    } else {
      throw new Error('Identity exists already, please call changeIdentity fn for updates');
    }
  }

  @Invokable()
  public async startService(
    @Param(yup.string())
    serviceId: string,
    @Param(yup.string())
    mecId: string
  ) {
    // Retrieve to see if exists
    const user = await User.getOne(this.sender);
    const service = await Service.getOne(serviceId);
    const mec = await MECNode.getOne(mecId);
    if (user && service && mec) {
      user.amount = user.amount - service.expense;
      if (user.amount < 0 ) {
        throw new Error('user amount is not sufficient');
      } else {
        let userLog = new UserLog();
        userLog.id = this.tx.identity.getMSPID();
        userLog.owner = this.sender;
        userLog.logType = LogType.START_SERVICE;
        userLog.service = serviceId;
        userLog.mec = mecId;

        user.logs.push(userLog);

        await userLog.save();
        await user.save();
      }
    } else {
      throw new Error('Identity exists already, please call changeIdentity fn for updates');
    }
  }

}