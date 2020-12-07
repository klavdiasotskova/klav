import { BigInt } from "@graphprotocol/graph-ts"
import {
  pixel,
  Approval,
  ApprovalForAll,
  OwnershipTransferred,
  PixelChainCreated,
  Transfer
} from "../generated/pixel/pixel"
import { transfer,Owner,Pixel,Total} from "../generated/schema"

export function handleApproval(event: Approval): void {
}

export function handleApprovalForAll(event: ApprovalForAll): void {
}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {
}

export function handlePixelChainCreated(event: PixelChainCreated): void {
  let tot = Total.load('0')
  if (tot == null) {
    tot = new Total('0')
    tot.totalpixels=BigInt.fromI32(0)
    tot.totalowners=BigInt.fromI32(0)
  }

  let entity = Pixel.load(event.params.id.toString())
  if (entity == null) {
    entity = new Pixel(event.params.id.toString())
    tot.totalpixels=tot.totalpixels+BigInt.fromI32(1)
  }
  let ownerent = Owner.load(event.params.author.toHex())
  if (ownerent == null) {
    ownerent = new Owner(event.params.author.toHex())
    tot.totalowners=tot.totalowners+BigInt.fromI32(1)
  }
  entity.owner=ownerent.id
  entity.name=event.params.name
  entity.palette=event.params.palette
  entity.data=event.params.data
  entity.save()

  tot.save()

}

export function handleTransfer(event: Transfer): void {
  let entity = transfer.load(event.transaction.hash.toHex()+'-'+event.params.tokenId.toString())
  if (entity == null) {
    entity = new transfer(event.transaction.hash.toHex()+'-'+event.params.tokenId.toString())
    entity.owner=event.params.from.toHex()
    entity.newowner=event.params.to.toHex()
    entity.pixel=event.params.tokenId.toString()
    entity.save()
  }
  let tot = Total.load('0')
  if (tot == null) {
    tot = new Total('0')
    tot.totalpixels=BigInt.fromI32(0)
    tot.totalowners=BigInt.fromI32(0)
  }
  let ownerent = Owner.load(event.params.to.toHex())
  if (ownerent == null) {
    ownerent = new Owner(event.params.to.toHex())
    ownerent.save()
    tot.totalowners=tot.totalowners + BigInt.fromI32(1)
      }

  let pix = Pixel.load(event.params.tokenId.toString())
  if (pix == null) {
    pix = new Pixel(event.params.tokenId.toString())
    tot.totalpixels=tot.totalpixels+BigInt.fromI32(1)
  }
  pix.owner=ownerent.id
  pix.save()
  tot.save()
}



// Note: If a handler doesn't require existing field values, it is faster
// _not_ to load the entity from the store. Instead, create it fresh with
// `new Entity(...)`, set the fields that should be updated and save the
// entity back to the store. Fields that were not set or unset remain
// unchanged, allowing for partial updates to be applied.

// It is also possible to access smart contracts from mappings. For
// example, the contract that has emitted the event can be connected to
// with:
//
// let contract = Contract.bind(event.address)
//
// The following functions can then be called on this contract to access
// state variables and other data:
//
// - contract.balanceOf(...)
// - contract.baseTokenURI(...)
// - contract.baseURI(...)
// - contract.getApproved(...)
// - contract.isApprovedForAll(...)
// - contract.isOwner(...)
// - contract.name(...)
// - contract.owner(...)
// - contract.ownerOf(...)
// - contract.pixelChains(...)
// - contract.retrieve(...)
// - contract.supportsInterface(...)
// - contract.symbol(...)
// - contract.tokenByIndex(...)
// - contract.tokenOfOwnerByIndex(...)
// - contract.tokenURI(...)
// - contract.totalSupply(...)
