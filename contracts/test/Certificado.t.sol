// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {Certificado} from "../src/Certificado.sol";

contract CertificadoTest is Test {
    Certificado public certificado;

    function setUp() public {
        certificado = new Certificado();
    }
}
