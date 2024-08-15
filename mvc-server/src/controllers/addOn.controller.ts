import { Request, Response } from "express";
import { AddOn } from "../models/addOn.model";

// Get all addons
export async function getAllAddOns(req: Request, res: Response) {
    const addons = await AddOn.find({});
    res.send(addons);
}


// create addon
export async function createAddOn(req: Request, res: Response) {

    const { name, description, price } = req.body;

    if (!name || !description || typeof price !== 'number') {
        res.status(400).send({
            message: "Please provide all required fields",
        });
        return;
    }

    const addOn = await AddOn.create(
        {
            name,
            description,
            price,
        }
    );
    res.send(addOn);
}

// edit addon
export async function editAddOn(req: Request, res: Response) {

    const addOn = await AddOn.findById(req.params.id);
    
    if (!addOn) {
        res.status(404).send({ message: "AddOn not found" });
        return;
    }

    if (req.body.name) {
        addOn.name = req.body.name;
    }
    if (req.body.description) {
        addOn.description = req.body.description;
    }
    if (req.body.price) {
        addOn.price = req.body.price;
    }
    await addOn.save();
    
    return res.send(addOn);
}

// delete addon
export async function deleteAddOn(req: Request, res: Response) {
    const addOn = await AddOn.findById(req.params.id);

    if (!addOn) {
      res.status(404).send({ message: "AddOn not found" });
      return;
    }

    await addOn.deleteOne({ _id: req.params.id });;

    res.send(addOn);
}


// get one addon 
export async function getAddOn(req:Request, res:Response) {

    const addOn = await AddOn.findById(req.params.id);

    if (!addOn) {
        return res.status(404).send({ message: "AddOn not found" });
    }

    res.send(addOn);
}
